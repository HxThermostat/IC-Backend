export * from "./polly";
export * from "./useTestData";
export const testif = (condition: boolean): jest.It =>
  condition ? test : test.skip;
