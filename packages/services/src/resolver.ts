let _serviceResolver: undefined | Map<string, any>;
export const serviceResolver = <T>() => {
  "use strict";
  if (!_serviceResolver) {
    _serviceResolver = new Map();
  }
  return {
    throughBind: (token: string, binding: () => T): T => {
      if (_serviceResolver?.has(token)) {
        return _serviceResolver.get(token);
      }
      const instance = binding();
      _serviceResolver?.set(token, instance);
      return instance;
    },
  };
};
