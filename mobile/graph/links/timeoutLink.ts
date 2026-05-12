import ApolloLinkTimeout from "apollo-link-timeout";

// Timeout: 10s
const timeoutLink = new ApolloLinkTimeout(10000);

export default timeoutLink;
