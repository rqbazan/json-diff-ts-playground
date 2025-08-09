import { applyChangeset, atomizeChangeset, diff, type IAtomicChange, type Options, unatomizeChangeset } from "json-diff-ts";

export type JsonType = string | number | boolean | object | JsonType[] | null;

/**
 * Generates a difference set for JSON objects. When comparing arrays, if a specific key is provided,
 * differences are determined by matching elements via this key rather than array indices.
 *
 * @param source - The source object to compare.
 * @param target - The target object to compare against.
 * @param options - Optional settings for the diff operation.
 * @returns - An array of changes that transform the source object into the target object.
 */
export function jsonDiff(source: JsonType, target: JsonType, options?: Options) {
  const changes = diff(source, target, options);

  return atomizeChangeset(changes);
}

/**
 * Applies a set of changes to an object, synchronizing it with the provided changes.
 *
 * @param obj - The object to apply changes to.
 * @param changes - The changes to apply.
 * @returns - The transformed object.
 */
export function jsonSync<T = JsonType>(obj: JsonType, changes: IAtomicChange[]): T {
  return applyChangeset(structuredClone(obj), unatomizeChangeset(changes));
}
