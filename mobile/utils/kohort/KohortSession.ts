import { loadFromAsyncStorage, saveToAsyncStorage } from "./localStorage";

/* 5 minutes */
export const MAX_SESSION_INACTIVE_TIME = 300000;
/* 30 seconds (for testing) */
// export const MAX_SESSION_INACTIVE_TIME = 30000;

export const DEFAULT_SESSION_ID = -1;

/**
 * KohortSession tracks session activity and manages expiring sessions when inactive
 */
export class KohortSession {
  private sessionId: number;
  private sessionTimer: number | undefined;

  constructor(sessionId: number = DEFAULT_SESSION_ID) {
    this.sessionId = sessionId;
  }

  markSessionActive(): void {
    if (this.sessionId === DEFAULT_SESSION_ID) {
      // New session, generate new id
      this.sessionId = Math.floor(Date.now() / 1000);
    }

    this.startInactivityTimer();
    this.saveSessionId(this.sessionId);
    this.saveLastActive();
  }

  startInactivityTimer(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }

    this.sessionTimer = setTimeout(
      () => this.handleSessionInactive(),
      MAX_SESSION_INACTIVE_TIME
    );
  }

  getCurrentSessionId(): number {
    return this.sessionId;
  }

  setCurrentSessionId(sessionId: number): void {
    this.sessionId = sessionId;
    this.startInactivityTimer();
    this.saveSessionId(this.sessionId);
    this.saveLastActive();
  }

  dispose(): void {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
  }

  isSessionExpired(lastActive: number): boolean {
    const elapsed = Date.now() - lastActive;
    return elapsed > MAX_SESSION_INACTIVE_TIME;
  }

  isDefaultSessionId(sessionId: number): boolean {
    return sessionId === DEFAULT_SESSION_ID;
  }

  async loadSessionInfoFromStorage(): Promise<void> {
    const [sessionId, lastActive] = await Promise.all([
      loadFromAsyncStorage<number>("kohort_session_id"),
      loadFromAsyncStorage<number>("kohort_session_last_active"),
    ]);

    // Bounce early if either of these is null
    if (sessionId == null || lastActive == null) {
      return;
    }

    // Check for session expiration since lastActive
    if (!this.isSessionExpired(lastActive)) {
      this.setCurrentSessionId(sessionId);
    }
  }

  private saveSessionId(sessionId: number): void {
    void saveToAsyncStorage("kohort_session_id", sessionId);
  }

  private saveLastActive(time: number = Date.now()): void {
    // Might want to debounce this in the future
    void saveToAsyncStorage("kohort_session_last_active", time);
  }

  private handleSessionInactive(): void {
    this.sessionTimer = undefined;
    this.sessionId = DEFAULT_SESSION_ID;
  }
}
