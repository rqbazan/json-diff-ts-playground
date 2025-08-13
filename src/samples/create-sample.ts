import type { DiffOptions } from "../lib/json-diff";
import { toJSON } from "../utils/functions";

type CreateSampleConfig = {
  source: object;
  target: object;
  diffOptions?: DiffOptions;
};

export function createSample({ source, target, diffOptions }: CreateSampleConfig) {
  return {
    source,
    target,
    sourceString: toJSON(source),
    targetString: toJSON(target),
    diffOptions,
  };
}
