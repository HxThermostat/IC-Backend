export type MaybeError<R, E extends Record<string, unknown>> = R | E;

export const isError = <E>(
  response: unknown,
  cb: (response: Record<string, unknown>) => boolean
): response is E => {
  if (typeof response !== "object") return false;
  if (response == null) return false;

  return cb(response as Record<string, unknown>);
};
