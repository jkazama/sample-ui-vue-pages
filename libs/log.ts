export const Level = {
  DEBUG: 10,
  INFO: 20,
  WARN: 30,
  ERROR: 40,
} as const;
export type Level = (typeof Level)[keyof typeof Level];

const dump = (prefix: string, obj: any) => {
  if (console) {
    // eslint-disable-next-line
    console.log(prefix, obj);
  }
};
const valid = (checkLevel: Level) => {
  const runtimeConfig = useRuntimeConfig();
  const defaultLevel = runtimeConfig.public
    .logLeveldefaultLevel as unknown as Level;
  const logLevel = defaultLevel;
  return logLevel <= checkLevel;
};
export namespace Log {
  export function debug(msg: any) {
    if (valid(Level.DEBUG)) {
      dump("[DEBUG] ", msg);
    }
  }
  export function info(msg: any) {
    if (valid(Level.INFO)) {
      dump("[INFO] ", msg);
    }
  }
  export function warn(msg: any) {
    if (valid(Level.WARN)) {
      dump("[WARN] ", msg);
    }
  }
  export function error(msg: any) {
    if (valid(Level.ERROR)) {
      dump("[ERROR] ", msg);
    }
  }
}
