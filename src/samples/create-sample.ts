import { toJSON } from "../utils/functions";

type CreateSampleConfig = {
  source: object;
  target: object;
};

export function createSample({ source, target }: CreateSampleConfig) {
  return {
    source,
    target,
    sourceString: toJSON(source),
    targetString: toJSON(target),
  };
}
