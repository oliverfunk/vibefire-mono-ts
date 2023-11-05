export const trimNCropText = (text: string, length: number = 500) => {
  text = text.trim();
  if (text.length > length) {
    return text.slice(0, length);
  }
  return text;
};
