export const toJSON = (value: unknown) => JSON.stringify(value, null, 2);

export function fromJSON(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return {};
  }
}
