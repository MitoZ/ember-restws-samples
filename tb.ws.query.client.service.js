const WebSocket = require('ws');

/**
 * Class representing a WebSocket client service for querying data.
 */
class TBWSQueryClientService {
  /**
   * Create a WebSocket client service.
   * @param {string} url - The WebSocket connection URL.
   * @param {Object} callbacks - The callback functions for WebSocket events.
   * @param {Function} [callbacks.onOpen] - Called when the WebSocket connection is opened.
   * @param {Function} [callbacks.onMessage] - Called when a message is received from the WebSocket server.
   * @param {Function} [callbacks.onError] - Called when an error occurs with the WebSocket connection.
   * @param {Function} [callbacks.onClose] - Called when the WebSocket connection is closed.
   */
  constructor(url, callbacks) {
    this.url = url;
    this.ws = null;
    if (callbacks && Object.keys(callbacks).length > 0) {
      this.callbacks = callbacks;
    }
  }
  
  /**
   * Create a query request object.
   * @param {string} query - The query string.
   * @param {boolean} live - Whether the query is live.
   * @param {string} dateFrom - The starting date for the query
   * @returns {Object} The query request object.
   */
  createQueryRequest(query, live, dateFrom/*, symbols,  types*/) {
    return {
      messageType: 'SUBSCRIBE_QUERY',
      query: query,
      live: live,
      from: dateFrom
    };
  }
  
  /**
   * Connect to the WebSocket subscription.
   * @param {string} token - The authentication token.
   */
  connect(token) {
    this.ws = new WebSocket(this.url, {
      headers: {
        'Cookie': 'access_token=' + encodeURIComponent(token) + '; path=/;' // Set the authentication token in the headers
      }
    });
    
    this.ws.onopen = () => this.onOpen(); // Handle the WebSocket open event
    this.ws.onmessage = (message) => this.onMessage(message); // Handle the WebSocket message event
    this.ws.onerror = (error) => this.onError(error); // Handle the WebSocket error event
    this.ws.onclose = (msg) => this.onClose(msg); // Handle the WebSocket close event
  }
  
  /**
   * Start a subscription with the given query.
   * @param {string} query - The query string.
   * @param {boolean} live - Whether the query is live.
   * @param {string} dateFrom - The starting date for the query.
   */
  startSubscription(query, live, dateFrom) {
    const request = JSON.stringify(this.createQueryRequest(query, live, dateFrom)); // Create the query request
    console.log("Subscribe request: " + request);
    this.ws.send(request); // Send the subscription request
  }
  
  /**
   * Handle the WebSocket open event.
   */
  onOpen() {
    if (this.callbacks?.onOpen) {
      this.callbacks.onOpen(this); // Call the onOpen callback if it exists.
    } else {
      console.log("### WS opened ###");
    }
  }
  
  /**
   * Handle the WebSocket message event.
   * @param {Object} message - The message received from the server.
   */
  onMessage(message) {
    if (this.callbacks?.onMessage) {
      this.callbacks.onMessage(message); // Call the onMessage callback if it exists.
    } else {
      console.log("MESSAGE: ", message.data);
    }
  }
  
  /**
   * Handle the WebSocket error event.
   * @param {Object} error - The error received from the server.
   */
  onError(error) {
    if (this.callbacks?.onError) {
      this.callbacks.onError(error, this); // Call the onError callback if it exists.
    }
    else {
      console.error(error);
    }
  }
  
  /**
   * Handle the WebSocket close event.
   * @param {Object} message - The close message received from the server.
   */
  onClose(message) {
    if (this.callbacks?.onClose) {
      this.callbacks.onClose(message, this); // Call the onClose callback if it exists.
    } else {
      console.log("### closed ###");
    }
  }
  
  /**
   * Disconnect from the WebSocket server.
   */
  disconnect() {
    if (this.ws) {
      this.ws.close(); // Close the WebSocket connection
    }
  }
}

module.exports = TBWSQueryClientService;
