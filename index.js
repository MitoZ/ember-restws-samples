const axios = require('axios'); // Import axios for making HTTP requests
const DataService = require('./data.service'); // Import DataService for managing trades
const TBWSQueryClientService = require('./tb.ws.query.client.service'); // Import WebSocket client service
const WSConnectionSettings = require('./ws.connection.settings'); //Import WebSocket Connection Settings
const SSOConnectionSettings = require('./sso.connection.settings'); //Import SSO Connection Settings

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
let client = new TBWSQueryClientService(`${WSConnectionSettings.TBWebAdminWSApiUrl}/query`, {
  onOpen: (client) => {
    /**
     * Start a subscription with the given query.
     * @param {string} query - The query string.
     * @param {boolean} live - Whether the query is live.
     * @param {string} dateFrom - The starting date for the query.
     */
    client.startSubscription(WSConnectionSettings.query, WSConnectionSettings.live, WSConnectionSettings.dateFrom);
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
}, {
  heartbeatInterval: WSConnectionSettings.heartbeatInterval
});

/**
 * Function to get an authorization token from your SSO Provider using client credentials.
 * @returns {Promise<string>} The authorization token.
 */
async function getSSOToken() {
  let requestData, headers;
  switch (SSOConnectionSettings.authType) {
    case 'SSO':
      requestData = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: SSOConnectionSettings.clientId,
        client_secret: SSOConnectionSettings.clientSecret,
      });
      headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      break;
    case 'BUILD_IN':
      requestData = new URLSearchParams({
        grant_type: 'password',
        username: SSOConnectionSettings.username,
        password: SSOConnectionSettings.password,
        scope: 'trust'
      });
      headers = {
        'Authorization': 'Basic d2ViOnNlY3JldA==',
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      break;
    default:
      break;
  }

  try {
    const response = await axios.post(SSOConnectionSettings.getTokenURL, requestData, {
      headers: headers,
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting token from SSO:', error);
    throw error;
  }
}

// Obtain the Auth token and connect the WebSocket client
getSSOToken()
  .then(token => {
    console.log('Access Token:', token);
    client.connect(token); // Connect the WebSocket client with the token
  })
  .catch(error => {
    console.error('Error:', error);
  });
