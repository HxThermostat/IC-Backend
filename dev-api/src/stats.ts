import StatsD from "hot-shots";

const client = new StatsD({
  globalTags: {
    env: process.env.NODE_ENV ?? "development",
  },
});

export default client;
