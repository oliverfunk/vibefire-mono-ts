import { useMemo } from "react";
import Timeline from "react-native-timeline-flatlist";
import _ from "lodash";

import { type TModelVibefireEventimelineElementT } from "@vibefire/models";
import { MONTH_DATE_TIME_LB_FORMAT, ntzToDateTime } from "@vibefire/utils";

export const EventTimeline = (props: {
  timelineElements: TModelVibefireEventimelineElementT[];
  timeStartIsoNTZ?: string;
  timeEndIsoNTZ?: string | null;
  // styling
  elementSpacing?: number;
}) => {
  const {
    timelineElements,
    timeStartIsoNTZ,
    timeEndIsoNTZ,
    elementSpacing = 12,
  } = props;

  const data = useMemo(() => {
    let rtn: {
      ts?: number;
      time: string;
      title: string;
      dotColor: string;
    }[] = [];
    if (timeStartIsoNTZ) {
      rtn.push({
        ts: ntzToDateTime(timeStartIsoNTZ).toUnixInteger(),
        time: ntzToDateTime(timeStartIsoNTZ).toFormat(
          MONTH_DATE_TIME_LB_FORMAT,
        ),
        title: "Start",
        dotColor: "white",
      });
    }

    timelineElements.forEach((element) =>
      rtn.push({
        ts: ntzToDateTime(element.timeIsoNTZ).toUnixInteger(),
        time: ntzToDateTime(element.timeIsoNTZ).toFormat(
          MONTH_DATE_TIME_LB_FORMAT,
        ),
        title: element.message,
        dotColor: "white",
      }),
    );

    if (timeEndIsoNTZ) {
      rtn.push({
        ts: ntzToDateTime(timeEndIsoNTZ).toUnixInteger(),
        time: ntzToDateTime(timeEndIsoNTZ).toFormat(MONTH_DATE_TIME_LB_FORMAT),
        title: "End",
        dotColor: "white",
      });
    }

    rtn = _.sortBy(rtn, ["ts"]);

    if (!timeStartIsoNTZ) {
      rtn.unshift({
        ts: undefined,
        time: "",
        title: "Start",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dotColor: "#FF2400",
      });
    }
    if (!timeEndIsoNTZ) {
      rtn.push({
        ts: undefined,
        time: "",
        title: "End",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dotColor: "#FF2400",
      });
    }
    return rtn;
  }, [timelineElements, timeStartIsoNTZ, timeEndIsoNTZ]);

  return (
    <Timeline
      data={data}
      isUsingFlatlist={false}
      innerCircle="dot"
      dotSize={5}
      circleColor="#FF2400"
      lineColor="white"
      renderFullLine={true}
      circleStyle={{ alignSelf: "center" }}
      timeContainerStyle={{
        // idk where the margin/padding is coming from
        marginRight: -10,
        height: "100%",
        justifyContent: "center",
        width: 70,
      }}
      timeStyle={{
        alignSelf: "center",
        fontWeight: "500",
        fontSize: 16,
        color: "white",
      }}
      eventContainerStyle={{
        // gets rid of weird connector edge
        marginTop: -2,
        paddingTop: elementSpacing,
        paddingBottom: elementSpacing,
        paddingLeft: 10,
      }}
      eventDetailStyle={{
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
      }}
      titleStyle={{
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        fontWeight: "400",
        fontSize: 18,
        lineHeight: 22,
        alignSelf: "flex-start",
        backgroundColor: "black",
        color: "white",
      }}
    />
  );
};
