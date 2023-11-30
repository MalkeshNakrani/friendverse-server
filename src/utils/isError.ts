// In strict typescirpt mode catch block error will have type unknown
const isError = (value: unknown) => {
  if (value instanceof Error) return value;
  let stringified = '[Unable to stringify the thrown value]';
  try {
    stringified = JSON.stringify(value);
  } catch {}

  const error = new Error(`This value was thrown as is, not through an Error: ${stringified}`);
  return error;
};

export default isError;
