import { LocatorContext } from "@vibefire/models";

export type ResourceLocator = Map<Symbol, unknown>;
let _resourceLocator: undefined | ResourceLocator;
export const resourceLocator = () => {
  "use strict";
  if (!_resourceLocator) {
    _resourceLocator = new Map();
  }
  const _ctx: LocatorContext = {};
  return {
    bindResource: <T>(
      token: Symbol,
      binding: (ctx: LocatorContext) => T,
    ): T => {
      if (_resourceLocator!.has(token)) {
        return _resourceLocator!.get(token) as T;
      }
      const instance = binding(_ctx);
      _resourceLocator!.set(token, instance);
      return instance;
    },
    setCtx: (ctx: LocatorContext) => {
      Object.assign(_ctx, ctx);
    },
  };
};
