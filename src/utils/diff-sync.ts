import isObjectLike from "lodash.isobjectlike";
import { type DiffOptions, jsonDiff, jsonSync } from "#/lib/json-diff";
import type { OptionsFormInputs } from "#/ui/app/options-fieldset";
import { fromJSON, toJSON } from "./json-functions";

export function convertToDiffOptions(formInputs: OptionsFormInputs): DiffOptions {
  return {
    keysToSkip: formInputs.keysToSkip?.map((item) => item.value) ?? [],
    embeddedObjKeys: Object.fromEntries(formInputs.embeddedObjKeys?.map((item) => [item.key, item.id]) ?? []),
    treatTypeChangeAsReplace: formInputs.treatTypeChangeAsReplace ?? false,
  };
}

export function convertToOptionsFormInputs(options: DiffOptions): OptionsFormInputs {
  return {
    keysToSkip: options.keysToSkip?.map((item) => ({ value: item })) ?? [],
    embeddedObjKeys: Object.entries(options.embeddedObjKeys ?? []).map(([key, id]) => ({ key, id })),
    treatTypeChangeAsReplace: options.treatTypeChangeAsReplace ?? false,
  };
}

export function getDefaultOptionsFormInputs(): OptionsFormInputs {
  return {
    keysToSkip: [],
    embeddedObjKeys: [],
    treatTypeChangeAsReplace: false,
  };
}

export type DiffOrSyncInput = string | object;

export const toObject = (value: unknown) => (isObjectLike(value) ? value : fromJSON(value as string));

export function getDiffString(sourceInput: DiffOrSyncInput, targetInput: DiffOrSyncInput, options: DiffOptions | undefined) {
  const source = toObject(sourceInput);
  const target = toObject(targetInput);

  const diff = jsonDiff(source, target, options);

  return toJSON(diff);
}

export function getTargetString(sourceInput: DiffOrSyncInput, changesInput: DiffOrSyncInput) {
  const source = toObject(sourceInput);
  const changes = toObject(changesInput);

  const target = jsonSync(source, changes);

  return toJSON(target);
}
