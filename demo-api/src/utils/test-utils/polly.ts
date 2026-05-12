import path from "path";

import { Polly } from "@pollyjs/core";
import { setupPolly as _setupPolly } from "setup-polly-jest";
import NodeHttpAdapter from "@pollyjs/adapter-node-http";
import FSPersister from "@pollyjs/persister-fs";

Polly.register(NodeHttpAdapter);
Polly.register(FSPersister);

const setupPolly = (dirname: string): ReturnType<typeof _setupPolly> =>
  _setupPolly({
    adapters: ["node-http"],
    persister: "fs",
    persisterOptions: {
      fs: {
        recordingsDir: path.resolve(dirname, "__recordings__"),
      },
    },
    recordIfMissing: process.env.RECORD === "1",
    recordFailedRequests: true,
    matchRequestsBy: {
      headers: {
        exclude: ["AUTHORIZATION"],
      },
    },
  });

export { Polly, setupPolly };
