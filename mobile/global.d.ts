declare function identity<T>(arg: T): T;
declare function isNotNull<T>(input: T | null | undefined): input is T;
declare function noop(): void;
declare function sleep(ms: number): Promise<void>;

// https://fettblog.eu/typescript-better-object-keys/
type ObjectKeys<T> = T extends Record<string, unknown>
  ? (keyof T)[]
  : T extends number
  ? []
  : // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Array<any> | string
  ? string[]
  : never;

interface ObjectConstructor {
  keys<T>(o: T): ObjectKeys<T>;
}
