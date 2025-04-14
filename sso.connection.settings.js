require('dotenv').config(); // Load environment variables from .env file

/**
 * Constants required for getting token from SSO provider.
 * @param {string} authType - Authentication type: 'BUILD_IN' || 'SSO'. 'BUILD_IN' - TB WebAdmin build-in authentication.
 * [For 'SSO' authType]
 * @param {string} authBaseUrl - The base URL of your SSO Provider server.
 * @param {string} realm -  The realm in Keycloak where the client is configured.
 * @param {string} clientId - The client ID used for authentication with your SSO Provider. Obtained from ENV constants.
 * @param {string} clientSecret - [For 'BUILD_IN' authType] The client secret used for authentication with your SSO Provider. Obtained from ENV constants.
 * [For 'BUILD_IN' authType]
 * @param {string} authBaseUrl - The base URL of your TB WebAdmin.
 * @param {string} username - Username/login.
 * @param {string} password - User's password.
 */
const SSOConnectionSettings = {
  authType: 'SSO' , // 'BUILD_IN' || 'SSO'
  authBaseUrl: 'your-base-auth-url',
  realm: 'your-realm',
  clientId: process.env.SSO_CLIENT_ID,
  clientSecret: process.env.SSO_CLIENT_SECRET,
  username: process.env.TBWA_USERNAME,
  password: process.env.TBWA_PASSWORD,
}

/**
 * @param {string} SSOConnectionSettings.getTokenURL - Getting token URL Constructor. Depends on authType.
*/
switch (SSOConnectionSettings.authType) {
  case 'SSO':
    SSOConnectionSettings.getTokenURL = `${SSOConnectionSettings.authBaseUrl}/realms/${SSOConnectionSettings.realm}/protocol/openid-connect/token`;
    break;
  case 'BUILD_IN':
    SSOConnectionSettings.getTokenURL = `${SSOConnectionSettings.authBaseUrl}/oauth/token`;
    break;
  default:
    break;
}

module.exports = SSOConnectionSettings;
