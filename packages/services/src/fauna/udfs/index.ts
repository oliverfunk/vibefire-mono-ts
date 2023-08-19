import { fql, Query, type Client, type QuerySuccess } from "fauna";

import { dfq } from "../utils";

export const createUDFPublicEventsInPeriodInAreas = async (
  faunaClient: Client,
) => {
  const q = fql`
    Function.create({
      name: "publicEventsInPeriodInAreas",
      body: <<-END
        (timePeriod, h3s) => {
          h3s.toSet().flatMap(h3 => Events.geoTemporal(timePeriod, h3, 'public', true))
        }
      END
    })
  `;
  return await dfq(faunaClient, q);
};
export const callPublicEventsInPeriodInAreas = async (
  faunaClient: Client,
  timePeriodIndex: string,
  areaH3s: number[],
) => {
  const q = fql`
    publicEventsInPeriodInAreas(
      ${timePeriodIndex}, ${areaH3s}
    )
  `;
  return (await dfq<{ data: any[] }>(faunaClient, q)).data;
};
