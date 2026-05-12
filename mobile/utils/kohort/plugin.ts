import {
  EventPlugin,
  EventType,
  PluginType,
  SegmentEvent,
} from "@segment/analytics-react-native";

import type { KohortTracking } from "./KohortTracking";

export class SessionPlugin extends EventPlugin {
  type = PluginType.enrichment;
  tracker: KohortTracking;

  constructor({ tracker }: { tracker: KohortTracking }) {
    super();
    this.tracker = tracker;
  }

  execute(event: SegmentEvent): SegmentEvent {
    let result = event;
    switch (result.type) {
      case EventType.IdentifyEvent:
      case EventType.TrackEvent:
      case EventType.ScreenEvent:
        // Bump session activity
        this.tracker.session.markSessionActive();
        result = this.addSessionIdToEvent(result);
        break;
      default:
        break;
    }
    return result;
  }

  addSessionIdToEvent(event: SegmentEvent): SegmentEvent {
    const result = event;
    const integrations = event.integrations;
    const sessionId = this.tracker.session.getCurrentSessionId();
    result.integrations = {
      ...integrations,
      Amplitude: {
        session_id: sessionId,
      },
      "Actions Amplitude": {
        session_id: sessionId,
      },
      Kraftful: {
        session_id: sessionId,
      },
    };
    return result;
  }
}

export const createSessionPlugin = (tracker: KohortTracking): SessionPlugin => {
  const sessionPlugin = new SessionPlugin({
    tracker,
  });

  return sessionPlugin;
};
