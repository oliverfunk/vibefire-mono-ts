export const debounce = <T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  fnPre?: () => void,
) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>): void => {
    fnPre?.();
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
