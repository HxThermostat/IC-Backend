// Mock the segment module while testing

class FakeAnalyticsClient {
  init = () => null;
  setup = () => null;
  screen = () => null;
  page = () => null;
  track = () => null;
  identify = () => null;
  group = () => null;
  reset = () => null;

  constructor() {
    this.userInfo = {
      get: () => ({
        anonymousId: 'anonymous-id',
      })
    }
  }
}

export const createClient = () => new FakeAnalyticsClient();

export class EventPlugin {

}
