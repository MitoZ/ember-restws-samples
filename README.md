# WebSocket Query Client Service

This project provides a WebSocket client service for querying trades data. The service runs in a Node.js environment.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Keycloak Configuration](#keycloak-configuration)
- [Usage](#usage)
- [Important Methods](#important-methods)
- [File Descriptions](#file-descriptions)
- [Documentation](#documentation)

## Requirements

- Node.js (version 20.x or higher)
- npm (version 10.x or higher)

## Installation

To install the necessary dependencies, run the following command:

```bash
npm install
```

## Configuration

Create a `.env` file in the root directory of your project and add the following variables:

```plaintext
KEYCLOAK_URL='your-keykloak-url'
KEYCLOAK_REALM='your-real'
KEYCLOAK_CLIENT_ID='your-client-id'
KEYCLOAK_CLIENT_SECRET='your-client-secret'
```

- **KEYCLOAK_URL**: The base URL of the Keycloak server.
- **KEYCLOAK_REALM**: The realm in Keycloak where the client is configured.
- **KEYCLOAK_CLIENT_ID**: The client ID used for authentication with Keycloak.
- **KEYCLOAK_CLIENT_SECRET**: The client secret used for authentication with Keycloak.

You can also pass environment variables through the CLI.
For example:

In UNIX
```bash
KEYCLOAK_CLIENT_ID=another-client-id node index.js
```
In Windows
```bash
set KEYCLOAK_CLIENT_ID=another-client-id && node index.js
```

In `connection.settings.js` there is few additional necessary parameters

```plaintext
{
    TBWebAdminWSApiUrl: 'ws://localhost:8099/ws/v0',
    query: 'select * from "warehouse-TRADES"',
    dateFrom: '1980-01-01T00:00:00.000Z',
    live: true,
}
```
- **TBWebAdminWSApiUrl**: TimeBase WebSockets api url
- **query**: QQL query for requesting data ([QQL Documentation](https://kb.timebase.info/community/development/qql/QQL%205.5/qql-tut-intro))
- **dateFrom**: The date from which the data will be selected.
  If an earlier date than the start of the stream is specified, the data selection will begin from the start of the stream. The data selection, in conjunction with dateFrom, is also influenced by the Subscription mode (specified below).
- **live**: Subscription mode.

If **live = true**: the subscription will return all data from dateFrom to the current moment and will remain active; as new records appear in the database, they will be sent to the subscription. if dateFrom is not specified, it will default to "Date Now."

If **live = false**: the subscription will return data from dateFrom to the current moment, and the subscription will then be closed. if dateFrom is not specified, the data will be selected from the very beginning of the stream.

## Keycloak Configuration
This is quick guide for creating keycloak client with `client_credentials` authorisation flow (grant_type).

### Keycloak before 19
1. **Log in to the Keycloak Admin Console**:
  - Open your browser and navigate to your Keycloak server (e.g., `http://localhost:8080`).
  - Log in to the Keycloak Admin Console using your admin credentials.

2. **Select Your Realm**:
  - From the dropdown menu in the top-left corner, select the realm where you want to create the client (or create a new realm if needed).

3. **Create a New Client**:
  - In the left-hand menu, click on "Clients".
  - Click on the "Create" button to create a new client.

4. **Client Settings**:
  - **Client ID**: Enter a unique identifier for your client (e.g., `websocket-client`). This is your `KEYCLOAK_CLIENT_ID`.
  - **Client Protocol**: Select `openid-connect`.
  - **Access Type**: Select `confidential`. This type requires a client secret for authentication.
  - **Standard Flow Enabled**: Leave this option enabled.
  - **Implicit Flow Enabled**: Leave this option disabled.
  - **Direct Access Grants Enabled**: Leave this option enabled.
  - **Service Accounts Enabled**: Leave this option enabled.
  - **Authorization Enabled**: Leave this option disabled.
  - **Valid Redirect URIs**: Fill with any one.
  - Click on "Save" to create the client.

5. **Obtain Client Secret**:
  - After saving, click on the "Credentials" tab.
  - Copy the value of the `Secret` field. This is your `KEYCLOAK_CLIENT_SECRET`.

### Keycloak 19 and later

1. **Log in to the Keycloak Admin Console**:
  - Open your browser and navigate to your Keycloak server (e.g., `http://localhost:8080`).
  - Log in to the Keycloak Admin Console using your admin credentials.

2. **Select Your Realm**:
  - From the dropdown menu in the top-left corner, select the realm where you want to create the client (or create a new realm if needed).

3. **Create a New Client**:
  - In the left-hand menu, click on "Clients".
  - Click on the "Create" button to create a new client.

4. **Client Settings**:
  - **Client ID**: Enter a unique identifier for your client (e.g., `websocket-client`). This is your `KEYCLOAK_CLIENT_ID`.
  - Click on "Next". 
  - **Client authentication**: Leave this option enabled.
  - **Standard Flow Enabled**: Leave this option enabled.
  - **Service accounts roles**: Leave this option enabled.
  - Click on "Next".
  - Click on "Save" to create the client.

5. **Obtain Client Secret**:
  - After saving, click on the "Credentials" tab.
  - Copy the value of the `Client Secret` field. This is your `KEYCLOAK_CLIENT_SECRET`.

## Usage

To run the service in a Node.js environment, use the following command:

```bash
node index.js
```

The application will obtain an authorization token from Keycloak and connect to the WebSocket server using the provided configuration.

## Important Methods

### TB WS Query Client Service

#### constructor(url, callbacks)

Creates a new instance of the WebSocket client service.

- `url` (string): The WebSocket server URL.
- `callbacks` (Object): The callback functions for WebSocket events.

#### connect(token)

Connects to the WebSocket server using the provided token.

- `token` (string): The authentication token.

#### startSubscription(query, live, dateFrom)

Starts a subscription with the given query.

- `query` (string): The query string.
- `live` (boolean): Whether the query is live.
- `dateFrom` (string): The starting date for the query.

#### disconnect()

Disconnects from the WebSocket server.

### DataService

#### constructor(onTradeClose)

Creates a new instance of the data service.

- `onTradeClose` (Function): The callback function to be called when a trade is closed.

#### addNewTrade(trades)

Adds new trades to the service.

- `trades` (Array): The array of trade objects.

#### getNotClosedTrades()

Returns the list of trades that are not closed.

## File Descriptions

### package.json

Defines the dependencies required for the project:

- **axios**: Used for making HTTP requests.
- **dotenv**: Module to load environment variables from a `.env` file.
- **ws**: WebSocket library for Node.js.

### index.js

Main entry point of the application. It performs the following tasks:

- Loads environment variables.
- Initializes the `DataService` with a callback function for closed trades.
- Configures and creates an instance of `TbWsQueryClientService`.
- Obtains an authorization token from Keycloak.
- Connects the WebSocket client using the obtained token.

### data.service.js

Defines the `DataService` class, which is responsible for managing trades:

- Stores trades in a map.
- Adds new trades to the map.
- Provides a method to get the list of not closed trades.

### tb.ws.query.client.service.js

Defines the `TbWsQueryClientService` class, which is responsible for managing WebSocket connections:

- Connects to the WebSocket server.
- Handles WebSocket events (open, message, error, close).
- Starts a subscription with the given query.
- Disconnects from the WebSocket server.

### .env

Configuration file for environment variables. It should contain the following variables:

- **KEYCLOAK_URL**: The base URL of the Keycloak server.
- **KEYCLOAK_REALM**: The realm in Keycloak where the client is configured.
- **KEYCLOAK_CLIENT_ID**: The client ID used for authentication with Keycloak.
- **KEYCLOAK_CLIENT_SECRET**: The client secret used for authentication with Keycloak.

### connection.settings.js

Configuration file for connection variables. It should contain the following variables:

- **TBWebAdminWSApiUrl**: TimeBase WebSockets api url.
- **query**: QQL query for requesting data.
- **dateFrom**: The date from which the data will be selected.
- **live**: Subscription mode.

## Documentation

For detailed documentation, please refer to the comments within the source code files.
