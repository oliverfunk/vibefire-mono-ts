export const debounce = <T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): void => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
