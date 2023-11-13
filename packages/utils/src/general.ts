export const trimAndCropText = (text: string, length: number = 500) => {
  text = text.trim();
  if (text.length > length) {
    return text.slice(0, length);
  }
  return text;
};

export const removeUndef = (
  obj: { [key: string]: unknown },
  removeEmpty = true,
) => {
  for (const key in obj) {
    const o = obj[key];
    if (o === undefined) {
      delete obj[key];
    } else if (o === null) {
      // leave it
    } else if (typeof o === "object") {
      if (Array.isArray(o)) {
        // filter out null, undefined, and empty string from the array
        obj[key] = (o as Array<unknown>).filter(
          (value) => value !== null && value !== undefined && value !== "",
        );
      } else {
        removeUndef(o as { [key: string]: unknown });

        if (removeEmpty && Object.keys(o).length === 0) {
          delete obj[key];
        }
      }
    }
  }
  return obj;
};
