export function buildError(code, message, paramMap = {}) {
  return {
    type: "error",
    code,
    message,
    paramMap,
  };
}
