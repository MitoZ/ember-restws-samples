/**
 * Class representing a data service for managing trades.
 */
class DataService {
  /**
   * Create a data service.
   * @param {Function} onTradeClose - The callback function to be called when a trade is closed.
   */
  constructor(onTradeClose) {
    this._trades = new Map(); // Initialize a map to store trades
    if (onTradeClose) {
      this.onTradeClose = onTradeClose; // Assign the onTradeClose callback function
    }
  }
  
  /**
   * Generate a unique identifier for a trades map.
   * @param {Object} trade - The trade object.
   * @returns {string} The unique identifier for the trades map.
   */
  generateUID(trade) {
    let _uid = trade.correlationOrderId;
    if (trade.sourceId) {
      _uid = `${trade.sourceId}:${trade.correlationOrderId}`;
    }
    return _uid;
  }
  
  /**
   * Add new trades to the trades map.
   * @param {Array} trades - The array of trade objects.
   */
  addNewTrade(trades) {
    trades.forEach(trade => {
      if (typeof trade === 'object' && Object.keys(trade).length) {
        const _uid = this.generateUID(trade); // Generate a unique identifier for the trade
        if (this._trades.has(_uid)) { // If related trades are present in the map, the current trade will go through a series of checks.
          const tradesList = [...(this._trades.get(_uid) || []), trade]; // Append the new trade to the existing list
          const remainingQuantity = parseFloat(trade.remainingQuantity + '');
          if (!isNaN(remainingQuantity)) {
            if (remainingQuantity !== 0 && trade.remainingQuantity !== '0.0') { // Check if the trade is the last, closing one.
              this._trades.set(_uid, tradesList);
              
            } else if (this.onTradeClose) {
              // If the trade is closing, all related trades are pulled from the map, sent to the callback, and removed from the map.
              // If the callback is not provided, the trades will remain in the map.
              this.onTradeClose(tradesList);
              this._trades.delete(_uid);
            }
          } else {
            this._trades.set(_uid, tradesList);
          }
        } else {
          this._trades.set(_uid, [trade]); // Add the trade to the map if it doesn't exist
        }
      }
    });
  }
  
  /**
   * Get the list of trades that are not closed.
   * @returns {Array} The array of not closed trades.
   */
  getNotClosedTrades() {
    return Array.from(this._trades.values()); // Return an array of not closed and related trades
  };
}

module.exports = DataService;
