let _serviceLocator: undefined | Map<string, unknown>;
export const serviceLocator = <T>() => {
  "use strict";
  if (!_serviceLocator) {
    _serviceLocator = new Map();
  }
  return {
    throughBind: (token: string, binding: () => T): T => {
      if (_serviceLocator?.has(token)) {
        return _serviceLocator.get(token) as T;
      }
      const instance = binding();
      _serviceLocator?.set(token, instance);
      return instance;
    },
  };
};
