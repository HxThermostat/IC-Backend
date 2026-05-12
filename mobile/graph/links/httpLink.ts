import { ApolloLink, createHttpLink } from "@apollo/client";
import fetch from "cross-fetch";

import { GRAPH_URL } from "~/config/constants";

console.debug({ GRAPH_URL });

const buildHttpLink = (graphUrl?: string): ApolloLink =>
  createHttpLink({
    uri: graphUrl ? graphUrl : GRAPH_URL,
    fetch,
  });

export default buildHttpLink;
