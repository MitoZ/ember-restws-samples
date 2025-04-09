require('dotenv').config(); // Load environment variables from .env file

/**
 * Constants required for getting token from SSO provider.
 * @param {string} getTokenURL - Getting token URL Constructor.
 * @param {string} SSOUrl - The base URL of your SSO Provider server.
 * @param {string} realm - The realm in Keycloak where the client is configured.
 * @param {string} clientId - The client ID used for authentication with your SSO Provider. Obtained from ENV constants.
 * @param {string} clientSecret - The client secret used for authentication with your SSO Provider. Obtained from ENV constants.
 */
const SSOConnectionSettings = {
  SSOUrl: 'your-sso-url',
  realm: 'your-realm',
  clientId: process.env.SSO_CLIENT_ID,
  clientSecret: process.env.SSO_CLIENT_SECRET,
}
SSOConnectionSettings.getTokenURL = `${SSOConnectionSettings.SSOUrl}/realms/${SSOConnectionSettings.realm}/protocol/openid-connect/token`;

module.exports = SSOConnectionSettings;
