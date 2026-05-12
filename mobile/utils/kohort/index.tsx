import {
  setupSegment,
  identifySegmentUser,
  trackSegmentEvent,
  trackSegmentScreen,
  resetSegmentForUser,
} from "./integrations/segment";

export * from "./contexts/KohortContext";

// Exported segment tracking methods for easier use
export {
  identifySegmentUser,
  resetSegmentForUser,
  trackSegmentEvent,
  trackSegmentScreen,
};

/**
 * Initialize the Kohort tracking library with your write key.
 */
export const initializeKohort = (
  writeKey = "VrDdh6uFZROsSNEN48RbM61zuL2evESM"
): void => {
  setupSegment(writeKey);
};
