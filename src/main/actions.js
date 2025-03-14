import { app, ipcMain, shell } from 'electron';
import path from 'node:path';
import fs from 'node:fs/promises';
import fetch from 'cross-fetch';
import https from 'https';

const USER_AGENT = 'ShooterGame/8 Windows/10.0.19042.1.768.64bit';
const CLIENT_PLATFORM =
  'ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuNzY4LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9';
const CLIENT_VERSION = 'release-10.04-shipping-7-3283852';

const LOCKFILE_PATH = path.join(
  process.env.APPDATA,
  '..',
  'local',
  '\\Riot Games\\Riot Client\\Config\\lockfile',
);

const encodeBase64 = (content) => Buffer.from(content).toString('base64');

const getWebHeaders = (authToken, entitlementstoken) => {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('User-Agent', USER_AGENT);
  headers.set('X-Riot-ClientPlatform', CLIENT_PLATFORM);
  headers.set('X-Riot-ClientVersion', CLIENT_VERSION);
  headers.set('X-Riot-Entitlements-JWT', entitlementstoken);
  headers.set('Authorization', `Bearer ${authToken}`);

  return headers;
};

/** performs authentication and populates the user object */
const auth = async () => {
  const user = {};

  // get port + password
  const lockfile = await fs.readFile(LOCKFILE_PATH, 'utf-8');
  const [, , port, password] = lockfile.split(':');
  const baseURL = `https://127.0.0.1:${port}/`;
  const basicAuth = encodeBase64(`riot:${password}`);

  const localEndpointHeaders = new Headers();
  localEndpointHeaders.set('Authorization', `Basic ${basicAuth}`);

  const agent = new https.Agent({ rejectUnauthorized: false });

  // fetch tokens
  const tokenResponse = await fetch(`${baseURL}entitlements/v1/token`, {
    headers: localEndpointHeaders,
    agent,
  });

  const tokenData = await tokenResponse.json();
  user.uuid = tokenData.subject;
  user.accessToken = tokenData.accessToken;
  user.entitlementsToken = tokenData.token;
  user.localEndpoint = baseURL;
  user.basicAuth = basicAuth;

  // prepare fetching urls: fetch external sessions
  const productSessionsResponse = await fetch(
    `${baseURL}product-session/v1/external-sessions`,
    {
      agent,
      headers: localEndpointHeaders,
    },
  );

  const productSessionsData = await productSessionsResponse.json();
  // check if game property is present, otherwise the game might not be running
  const remoteAuthToken = Object.keys(productSessionsData).find(
    (k) => k !== 'host_app',
  );
  if (!remoteAuthToken)
    return {
      error: 'could not find the remote auth token. is the game runnning??',
    };

  const { arguments: launchArgs } =
    productSessionsData[remoteAuthToken].launchConfiguration;

  const shardPrefix = '-ares-deployment=';
  user.shard = launchArgs
    .find((arg) => arg.startsWith(shardPrefix))
    ?.replace(shardPrefix, '');

  const configEndpointPrefix = '-config-endpoint=';
  user.configEndpoint = launchArgs
    .find((arg) => arg.startsWith(configEndpointPrefix))
    ?.replace(configEndpointPrefix, '');

  const webHeaders = getWebHeaders(user.accessToken, user.entitlementsToken);

  // fetch config
  const configResponse = await fetch(
    `${user.configEndpoint}/v1/config/${user.shard}`,
    {
      headers: webHeaders,
      agent,
    },
  );
  const configData = await configResponse.json();
  user.playerURL = configData?.Collapsed?.SERVICEURL_NAME;
  user.coreGameURL = configData?.Collapsed?.SERVICEURL_COREGAME;

  // fetch user info
  const userInfoResponse = await fetch('https://auth.riotgames.com/userinfo', {
    agent,
    headers: webHeaders,
  });
  const userInfoData = await userInfoResponse.json();
  user.username = `${userInfoData.acct.game_name}#${userInfoData.acct.tag_line}`;

  return { success: user };
};

/** updates loadout with new skins */
const equip = async (uuid, user) => {
  const webHeaders = getWebHeaders(user.accessToken, user.entitlementsToken);
  const agent = new https.Agent({ rejectUnauthorized: false });

  const weaponsResponse = await fetch('https://valorant-api.com/v1/weapons');
  const weaponsData = await weaponsResponse.json();

  // find gun type
  const gun = weaponsData.data
    .flatMap((gunType) =>
      gunType.skins.map((skin) => ({ type: gunType.uuid, ...skin })),
    )
    .find((gun) => gun.uuid === uuid);

  const loadoutURL = `${user.playerURL}/personalization/v2/players/${user.uuid}/playerloadout`;
  const loadoutResponse = await fetch(loadoutURL, {
    headers: webHeaders,
    agent,
  });
  const currentLoadout = await loadoutResponse.json();

  // modify current loadout with new skin uuid
  currentLoadout.Guns.find((g) => g.ID === gun.type).SkinID = uuid;

  // upload new skin config
  const updateResponse = await fetch(loadoutURL, {
    method: 'PUT',
    body: JSON.stringify(currentLoadout),
    headers: webHeaders,
    agent,
  });

  if (updateResponse.status === 200) return { success: 'Status updated' };

  return { error: 'Could not equip skin' };
};

const updateTier = async (tier, user) => {
  // generate private config
  const privateConfig = {
    isValid: true,
    sessionLoopState: 'MENUS',
    partyOwnerSessionLoopState: 'INGAME',
    customGameName: '',
    customGameTeam: '',
    partyOwnerMatchMap: '',
    partyOwnerMatchCurrentTeam: '',
    partyOwnerMatchScoreAllyTeam: 0,
    partyOwnerMatchScoreEnemyTeam: 0,
    partyOwnerProvisioningFlow: 'Invalid',
    provisioningFlow: 'Invalid',
    matchMap: '',
    partyId: '727',
    isPartyOwner: true,
    partyState: 'DEFAULT',
    maxPartySize: 5,
    queueId: '',
    partyLFM: false,
    partySize: 1,
    tournamentId: '',
    rosterId: '',
    partyVersion: 1650719279092,
    queueEntryTime: '0001.01.01-00.00.00',
    playerCardId: '',
    playerTitleId: '',
    preferredLevelBorderId: '',
    accountLevel: 69,
    competitiveTier: tier,
    leaderboardPosition: 0,
    isIdle: true,
  };
  const privateEncoded = encodeBase64(JSON.stringify(privateConfig));

  const config = {
    state: 'chat',
    private: privateEncoded,
    shared: {
      actor: '',
      details: '',
      location: '',
      product: 'valorant',
      time: new Date().valueOf() + 35000,
    },
  };

  // update config
  const headers = new Headers();
  headers.set('Authorization', `Basic ${user.basicAuth}`);
  headers.set('Content-Type', 'application/json');

  const updateResponse = await fetch(`${user.localEndpoint}chat/v2/me`, {
    body: JSON.stringify(config),
    method: 'PUT',
    agent: new https.Agent({ rejectUnauthorized: false }),
    headers,
  });

  if (updateResponse.status === 201) return { success: 'Rank updated' };

  return { error: 'Could not update rank' };
};

export default function initActions() {
  ipcMain.handle('exit_app', () => app.exit());
  ipcMain.handle('open_external', (_, url) => shell.openExternal(url));
  ipcMain.handle('auth', auth);
  ipcMain.handle('equip', (_, uuid, user) => equip(uuid, user));
  ipcMain.handle('update_tier', (_, tier, user) => updateTier(tier, user));
}
