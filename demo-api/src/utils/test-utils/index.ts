export * from "./polly";
export const testif = (condition: boolean): jest.It =>
  condition ? test : test.skip;
