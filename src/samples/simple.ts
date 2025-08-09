import { createSample } from "./create-sample";

export const simpleSample = createSample({
  source: {
    name: "John",
    age: 30,
    hobbies: ["reading", "gaming"],
  },
  target: {
    name: "John Doe",
    age: 31,
    hobbies: ["reading", "gaming", "cooking"],
  },
});
