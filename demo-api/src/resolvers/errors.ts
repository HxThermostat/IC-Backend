import { NotFound, NotSupported } from "../schema/resolvers-types";

export function NotFound(message?: string): NotFound {
  return {
    __typename: "NotFound" as const,
    message,
  };
}

export function NotSupported(message?: string): NotSupported {
  return {
    __typename: "NotSupported" as const,
    message,
  };
}

export function ResolverNotSupported(message?: string): () => NotSupported {
  return () => NotSupported(message);
}

export function ResolverNotImplemented<R>(message?: string): () => R {
  return () => {
    throw new Error(message ? `NotImplemented: ${message}` : "NotImplemented");
  };
}
