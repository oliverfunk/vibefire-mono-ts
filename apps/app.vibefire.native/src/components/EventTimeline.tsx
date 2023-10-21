import { useMemo } from "react";
import Timeline from "react-native-timeline-flatlist";
import _ from "lodash";

import { type VibefireEventTimelineElementT } from "@vibefire/models";
import { isoNTZToDateTime, MONTH_DATE_TIME_LB_FORMAT } from "@vibefire/utils";

export const EventTimeline = (props: {
  timelineElements: VibefireEventTimelineElementT[];
  timeStartIsoNTZ: string;
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
    let rtn = [];
    rtn.push({
      ts: isoNTZToDateTime(timeStartIsoNTZ).toUnixInteger(),
      time: isoNTZToDateTime(timeStartIsoNTZ).toFormat(
        MONTH_DATE_TIME_LB_FORMAT,
      ),
      title: "Start",
      dotColor: undefined,
    });
    timelineElements.forEach((element) =>
      rtn.push({
        ts: isoNTZToDateTime(element.timeIsoNTZ).toUnixInteger(),
        time: isoNTZToDateTime(element.timeIsoNTZ).toFormat(
          MONTH_DATE_TIME_LB_FORMAT,
        ),
        title: element.message,
        dotColor: undefined,
      }),
    );
    if (timeEndIsoNTZ) {
      rtn.push({
        ts: isoNTZToDateTime(timeEndIsoNTZ).toUnixInteger(),
        time: isoNTZToDateTime(timeEndIsoNTZ).toFormat(
          MONTH_DATE_TIME_LB_FORMAT,
        ),
        title: "End",
        dotColor: "white",
      });
      rtn = _.sortBy(rtn, ["ts"]);
    } else {
      rtn = _.sortBy(rtn, ["ts"]);
      rtn.push({
        time: "",
        title: "End",
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dotColor: "red",
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
      circleColor="red"
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
        // defines the border
        // borderColor: "black",
        borderBottomColor: "white",
        borderWidth: 2,
        borderRadius: 2,
        overflow: "hidden",
      }}
    />
  );
};
