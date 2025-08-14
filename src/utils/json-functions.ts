export const toJSON = (value: unknown) => JSON.stringify(value, null, 2);

export function fromJSON(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}

export function isValidJson(value: unknown) {
  if (typeof value !== "string") {
    return false;
  }

  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}
