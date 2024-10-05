import { type LocatorContext } from "@vibefire/models";

export type ResourceLocator = Map<symbol, unknown>;
let _resourceLocator: undefined | ResourceLocator;
let _locatorCtx: LocatorContext = {};
export const resourceLocator = () => {
  "use strict";
  if (!_resourceLocator) {
    _resourceLocator = new Map();
  }
  return {
    bindResource: <T>(
      token: symbol,
      binding: (ctx: LocatorContext) => T,
    ): T => {
      if (_resourceLocator!.has(token)) {
        return _resourceLocator!.get(token) as T;
      }
      const instance = binding(_locatorCtx);
      _resourceLocator!.set(token, instance);
      return instance;
    },
    setCtx: (ctx: LocatorContext) => {
      _locatorCtx = ctx;
    },
  };
};
