import { tracer } from "dd-trace";

import { ENABLE_DATADOG } from "./config";

// initialized in a different file to avoid hoisting
if (ENABLE_DATADOG) {
  tracer.init();
}

export default tracer;
