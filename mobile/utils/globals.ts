global.identity = <T>(arg: T) => arg;
global.isNotNull = <T>(input: T | null | undefined): input is T =>
  input != null;
global.noop = () => null;
global.sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
