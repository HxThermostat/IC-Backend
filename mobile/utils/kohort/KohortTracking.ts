import { KohortSession } from "./KohortSession";
import { identifySegmentUser, trackSegmentEvent } from "./integrations/segment";
import type { JsonMap } from "@segment/analytics-react-native";

export type KohortTrackedUser = {
  userId: string;
  customTraits: JsonMap;
};

export type KohortTrackedEvent = {
  event: string;
  properties: JsonMap;
};

export type KohortFunnelEvent = {
  funnel: string;
  step: KohortFunnelEventStep;
};

export type KohortTrackProperties = {
  kohortTrack: 1;
};

export type KohortFeatureProperties = KohortTrackProperties & {
  kohortFeature: string;
  kohortFeatureTag?: string;
};

export enum KohortFunnel {
  Adoption = "Adoption",
  SignIn = "Sign In",
  Connection = "Connection",
}

export enum KohortFunnelEventStep {
  Action = "Action",
  Connection = "Connection",
  ConnectionStart = "Connection Start",
  ConnectionSuccess = "Connection Success",
  SignIn = "Sign In",
  SignInStart = "Sign In Start",
  SignInSuccess = "Sign In Success",
}

/**
 * KohortTracking exposes Kohort specific tracking functions that add the
 * relevant properties to the Segment calls.
 */
export class KohortTracking {
  public session: KohortSession;

  constructor() {
    this.session = new KohortSession();
  }

  identify(userId: string, customTraits: JsonMap): void {
    this.identifyUser({
      userId,
      customTraits,
    });
  }

  trackFeatureUse(feature: string, tag: string | null = null): void {
    const additionalProperties: KohortFeatureProperties = {
      kohortTrack: 1,
      kohortFeature: feature,
    };

    if (tag != null) {
      additionalProperties.kohortFeatureTag = tag;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore We have already checked kohortFeatureTag for undefined above
    this.trackEvent({ event: feature, properties: additionalProperties });
  }

  trackFunnel({
    step,
    funnel = KohortFunnel.Adoption,
  }: {
    funnel?: KohortFunnel;
    step: KohortFunnelEventStep;
  }): void {
    this.trackFunnelEvent({
      funnel,
      step,
    });
  }

  private identifyUser(trackedUser: KohortTrackedUser): void {
    identifySegmentUser(trackedUser.userId, trackedUser.customTraits);
  }

  private trackFunnelEvent(details: KohortFunnelEvent): void {
    const stepName = details.step.toString();
    trackSegmentEvent(`${stepName}`, {
      kohortTrack: 1,
      kohortFunnel: details.funnel,
      kohortStepName: stepName,
    });
  }

  private trackEvent(details: KohortTrackedEvent): void {
    const { event, properties } = details;

    trackSegmentEvent(event, properties);
  }

  private static _instance: KohortTracking | undefined;
  static singleton(): KohortTracking {
    if (!KohortTracking._instance) {
      KohortTracking._instance = new KohortTracking();
    }

    return KohortTracking._instance;
  }
}
