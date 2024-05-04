import { type Permutation } from "@vibefire/utils";

export type TwSpacings =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "8"
  | "10"
  | "12"
  | "16"
  | "20"
  | "24"
  | "32"
  | "40"
  | "48"
  | "56"
  | "64";

export type TwSpacing<S extends string, V extends TwSpacings> = {
  s: S;
  v: V;
};

type P = TwSpacing<"p", TwSpacings>;
type Px = TwSpacing<"px", TwSpacings>;
type Py = TwSpacing<"py", TwSpacings>;
type Pt = TwSpacing<"pt", TwSpacings>;
type Pr = TwSpacing<"pr", TwSpacings>;
type Pb = TwSpacing<"pb", TwSpacings>;
type Pl = TwSpacing<"pl", TwSpacings>;

type M = TwSpacing<"m", TwSpacings>;
type Mx = TwSpacing<"mx", TwSpacings>;
type My = TwSpacing<"my", TwSpacings>;
type Mt = TwSpacing<"mt", TwSpacings>;
type Mr = TwSpacing<"mr", TwSpacings>;
type Mb = TwSpacing<"mb", TwSpacings>;
type Ml = TwSpacing<"ml", TwSpacings>;

export type TwPadding =
  | P
  | Px
  | Py
  | Pt
  | Pr
  | Pb
  | Pl
  | Permutation<Pl | Pr>
  | Permutation<Pt | Pb>
  | Permutation<Px | Pt>
  | Permutation<Px | Pb>
  | Permutation<Pl | Py>
  | Permutation<Pr | Py>
  | Permutation<Px | Py>
  | Permutation<Pl | Pr | Pt>
  | Permutation<Pl | Pr | Pb>
  | Permutation<Pl | Pt | Pb>
  | Permutation<Pr | Pt | Pb>
  | Permutation<Px | Pt | Pb>
  | Permutation<Pl | Pr | Py>
  | Permutation<Pt | Pr | Pb | Pl>;

export type TwMargin =
  | M
  | Mx
  | My
  | Mt
  | Mr
  | Mb
  | Ml
  | Permutation<Ml | Mr>
  | Permutation<Mt | Mb>
  | Permutation<Mx | Mt>
  | Permutation<Mx | Mb>
  | Permutation<Ml | My>
  | Permutation<Mr | My>
  | Permutation<Mx | My>
  | Permutation<Ml | Mr | Mt>
  | Permutation<Ml | Mr | Mb>
  | Permutation<Ml | Mt | Mb>
  | Permutation<Mr | Mt | Mb>
  | Permutation<Mx | Mt | Mb>
  | Permutation<Ml | Mr | My>
  | Permutation<Mt | Mr | Mb | Ml>;

export const p = (v: TwSpacings): P => ({ s: "p", v });
export const px = (v: TwSpacings): Px => ({ s: "px", v });
export const py = (v: TwSpacings): Py => ({ s: "py", v });
export const pt = (v: TwSpacings): Pt => ({ s: "pt", v });
export const pr = (v: TwSpacings): Pr => ({ s: "pr", v });
export const pb = (v: TwSpacings): Pb => ({ s: "pb", v });
export const pl = (v: TwSpacings): Pl => ({ s: "pl", v });

export const m = (v: TwSpacings): M => ({ s: "m", v });
export const mx = (v: TwSpacings): Mx => ({ s: "mx", v });
export const my = (v: TwSpacings): My => ({ s: "my", v });
export const mt = (v: TwSpacings): Mt => ({ s: "mt", v });
export const mr = (v: TwSpacings): Mr => ({ s: "mr", v });
export const mb = (v: TwSpacings): Mb => ({ s: "mb", v });
export const ml = (v: TwSpacings): Ml => ({ s: "ml", v });

export const tws = (s?: TwPadding | TwMargin): string =>
  !s ? "" : Array.isArray(s) ? s.map(tws).join(" ") : `${s.s}-${s.v}`;

export default TwSpacings;
