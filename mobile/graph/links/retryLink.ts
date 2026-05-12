import { RetryLink } from "@apollo/client/link/retry";

// It provides exponential backoff, and jitters delays between attempts by default.
// It currently handles network errors only.
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 2000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error) => !!error,
  },
});

export default retryLink;
