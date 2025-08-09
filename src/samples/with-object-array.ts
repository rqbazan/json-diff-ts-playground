import { createSample } from "./create-sample";

export const withObjectArraySample = createSample({
  source: {
    endpoints: [
      { path: "/api/v1/users", method: "GET" },
      { path: "/api/v1/users", method: "POST" },
    ],
  },
  target: {
    endpoints: [
      { path: "/api/v2/users", method: "GET" },
      { path: "/api/v2/users", method: "PUT" },
      { path: "/api/v2/users", method: "DELETE" },
    ],
  },
});
