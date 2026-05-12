import { random } from "lodash";

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const randSleep = (min: number, max: number): Promise<void> =>
  sleep(random(min, max));
