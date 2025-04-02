/**
 * Constants required for establishing a WS connection and configuring the subscription.
 * @param {string} onTradeClose - TimeBase WebSockets api url.
 * @param {string} onTradeClose - QQL query for requesting data.
 * @param {string} onTradeClose - The date (only ISODateString) from which the data will be selected.
 * @param {boolean} onTradeClose - Subscription mode.
 */
const connectionSettings = {
  TBWebAdminWSApiUrl: 'ws://localhost:8099/ws/v0',
  query: 'select * from "warehouse-TRADES"',

  /**
   * The date from which the data will be selected.
   * If an earlier date than the start of the stream is specified, the data selection will begin from the start of the stream.
   * The data selection, in conjunction with dateFrom, is also influenced by the Subscription mode (specified below).
   */
  dateFrom: '1980-01-01T00:00:00.000Z',

  /**
   * Subscription mode.
   *
   * If live = true:
   * the subscription will return all data from dateFrom to the current moment and will remain active;
   * as new records appear in the database, they will be sent to the subscription;
   * if dateFrom is not specified, it will default to "Date Now."
   *
   * If live = false:
   * the subscription will return data from dateFrom to the current moment, and the subscription will then be closed;
   * if dateFrom is not specified, the data will be selected from the very beginning of the stream.
   */
  live: true,
}

module.exports = connectionSettings;
