const axios = require('axios'); // Import axios for making HTTP requests
require('dotenv').config(); // Load environment variables from .env file
const DataService = require('./data.service'); // Import DataService for managing trades
const TBWSQueryClientService = require('./tb.ws.query.client.service'); // Import WebSocket client service
const connectionSettings = require('./connection.settings'); //Import Connection Settings

// Initialize DataService with a callback function for closed trades
const Orders_Service = new DataService((closedTrade) => {
  // Here you can set up logging or call the necessary services for further processing of closed trades.
  console.log('Closed Trade: ', closedTrade);
});

// WebSocket API URL and query parameters

/**
 * Create WebSocket client service with event handlers
 * @param {string} url - The WebSocket connection URL.
 * @param {Object} callbacks - The callback functions for WebSocket events.
 * @param {Function} [callbacks.onOpen] - Called when the WebSocket connection is opened.
 * @param {Function} [callbacks.onMessage] - Called when a message is received from the WebSocket server.
 * @param {Function} [callbacks.onError] - Called when an error occurs with the WebSocket connection.
 * @param {Function} [callbacks.onClose] - Called when the WebSocket connection is closed.
 */
let client = new TBWSQueryClientService(`${connectionSettings.TBWebAdminWSApiUrl}/query`, {
  onOpen: (client) => {
    /**
     * Start a subscription with the given query.
     * @param {string} query - The query string.
     * @param {boolean} live - Whether the query is live.
     * @param {string} dateFrom - The starting date for the query.
     */
    client.startSubscription(connectionSettings.query, connectionSettings.live, connectionSettings.dateFrom);
  },
  onMessage: (message) => {
    try {
      message = JSON.parse(message.data);
      if (!message.status && message.length) {
        Orders_Service.addNewTrade(message); // Add new trades to the service
      } else {
        console.log(message);
      }
    } catch (e) {
      console.error(e);
    }
  },
  onError: (message, client) => {
    console.error('Error Trades Subscription', message);
  },
  onClose: (message, client) => {
    console.warn('Closed Trades Subscription', message);
    console.log('Not Closed Trades:', Orders_Service.getNotClosedTrades()); // Log trades that are not closed
  },
});

/**
 * Function to get an authorization token from Keycloak using client credentials.
 * @returns {Promise<string>} The authorization token.
 */
async function getKeycloakToken() {
  const tokenUrl = connectionSettings.SSOGetTokenURL;

  const requestData = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: process.env.KEYCLOAK_CLIENT_ID,
    client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
  });

  try {
    const response = await axios.post(tokenUrl, requestData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting token from Keycloak:', error);
    throw error;
  }
}

// Obtain the Keycloak token and connect the WebSocket client
getKeycloakToken()
  .then(token => {
    console.log('Access Token:', token);
    client.connect(token); // Connect the WebSocket client with the token
  })
  .catch(error => {
    console.error('Error:', error);
  });
