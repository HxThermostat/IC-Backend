# Klimate API

## Getting Started

To get up-and-running, install the dependencies, build the schema + source, and start the server:

```
yarn install
yarn build
yarn start
```

You can open the GraphQL Playground at http://localhost:3000/.

There are additional commands that are useful while developing:

```
yarn watch-ts # builds TypeScript source incrementally with each change
yarn watch-node # restarts the running server wich each change
yarn watch-graph # builds the TypeScript types for the GraphQL schema with each (schema) change
```

I'd recommend running `yarn watch-ts` and `yarn watch-node` in two shells and `yarn build-graph` as-needed.

## Testing

You can run the test suite via:

```
yarn test
```
