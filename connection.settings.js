/**
 * Constants required for establishing a WS connection and configuring the subscription.
 * @param {string} onTradeClose - TimeBase WebSockets api url.
 * @param {string} onTradeClose - QQL query for requesting data.
 * @param {string} onTradeClose - The date (ISODateString or UNIX Timestamp) from which the data will be selected.
 * @param {boolean} onTradeClose - Subscription mode.
 */
const connectionSettings = {
  TBWebAdminWSApiUrl: 'ws://localhost:8099/ws/v0',
  query: 'select * from "warehouse-TRADES"',

  /**
   * The date from which the data will be selected.
   * If an earlier date than the start of the stream is specified, the data selection will begin from the start of the stream.
   * if dateFrom is not specified, the data will be selected from the very beginning of the stream.
   */
  dateFrom: '1980-01-01T00:00:00.000Z',

  /**
   * Subscription mode.
   *
   * If live = true:
   * the subscription will return all data from dateFrom to the current moment and will remain active;
   * as new records appear in the database, they will be sent to the subscription;
   *
   * If live = false:
   * the subscription will return data from dateFrom to the current moment, and the subscription will then be closed;
   */
  live: true,
}

module.exports = connectionSettings;
