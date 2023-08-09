import { jest } from "@jest/globals";
import { Type as t } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

import { tbValidator } from "@vibefire/utils";

const foo = t.Object({
  a: t.String({ minLength: 1 }),
  b: t.Number({ minimum: 1, default: 10 }),
  c: t.Object({
    d: t.String(),
    e: t.Number({ minimum: 1, default: 10 }),
  }),
});

const eml = t.String({ format: "email" });

test("this is a test", () => {
  const emlValidator = tbValidator(eml);

  console.log(emlValidator("foo@bar.com"));

  const fooValidator = tbValidator(foo);

  const testA = { a: "a", b: 1, c: { d: "", e: 1 } };
  const testB = { a: "a", c: { d: "" } };
  const testC = { a: 1, c: { d: "", e: 1 } };

  console.log(fooValidator(testA)); // pass: { a: 'a', b: 1, c: { d: '', e: 1 } }
  console.log(fooValidator(testB)); // fails, would like to pass with the same as testA
  console.log(fooValidator(testC)); // should fails because a is not a string (only, not because b is also missing)

  //   const b = Value.Create(a);

  //   Object.keys(b).forEach((key keyof aT) => {
  //     if (!(key in d)) {
  //       d[key] = b[key];
  //     }
  //   });
});
