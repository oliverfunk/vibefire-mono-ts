export const safeGet = async <T>(
  getter: Promise<T>,
  errorMessage = "Not found",
) => {
  const res = await getter;
  if (res === null) {
    throw new Error(errorMessage);
  }
  return res;
};
