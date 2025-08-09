import { createSample } from "./create-sample";

export const withPrimitiveArraySample = createSample({
  source: { items: [100, 200, 300, 400, 500] },
  target: { items: [100, 250, 300, 400, 550] },
});
