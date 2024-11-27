const getConfigLocationsByEnv = (env: string): string[] => [
  '.env.local',
  `.env.${env}`,
  '.env',
];

const prependAppDirectory = (appName: string) => (fileName: string) =>
  `apps/${appName}/${fileName}`;

const withAppSpecificConfigLocations = (
  appName: string,
  fileNames: string[],
) => [...fileNames.map(prependAppDirectory(appName)), ...fileNames];

const getConfigLocations = (appName: string, env: string) =>
  withAppSpecificConfigLocations(appName, getConfigLocationsByEnv(env));

export default getConfigLocations;
