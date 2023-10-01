import { useMemo } from "react";
import Timeline from "react-native-timeline-flatlist";

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
    elementSpacing = 10,
  } = props;

  const data = useMemo(() => {
    const rtn = [];
    rtn.push({
      time: isoNTZToDateTime(timeStartIsoNTZ).toFormat(
        MONTH_DATE_TIME_LB_FORMAT,
      ),
      title: "Start",
    });
    timelineElements.map((element) => ({
      time: isoNTZToDateTime(element.timeIsoNTZ).toFormat(
        MONTH_DATE_TIME_LB_FORMAT,
      ),
      title: element.message,
    }));
    rtn.push({
      time: timeEndIsoNTZ
        ? isoNTZToDateTime(timeEndIsoNTZ).toFormat(MONTH_DATE_TIME_LB_FORMAT)
        : "",
      title: "End",
      dotColor: timeEndIsoNTZ ? "white" : "orange",
    });
    return rtn;
  }, [timelineElements, timeStartIsoNTZ, timeEndIsoNTZ]);

  return (
    <Timeline
      data={data}
      isUsingFlatlist={false}
      innerCircle="dot"
      dotSize={5}
      circleColor="orange"
      lineColor="black"
      renderFullLine={true}
      circleStyle={{ alignSelf: "center" }}
      timeContainerStyle={{
        // idk where the margin/padding is coming from
        marginRight: -10,
        height: "100%",
        justifyContent: "center",
        width: 60,
      }}
      timeStyle={{
        alignSelf: "center",
        fontWeight: "500",
        fontSize: 14,
      }}
      eventContainerStyle={{
        // gets rid of weird connector edge
        marginTop: -1,
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
        fontWeight: "500",
        fontSize: 14,
        alignSelf: "flex-start",
        backgroundColor: "black",
        color: "white",
        // defines the border
        borderColor: "orange",
        borderWidth: 2,
        borderRadius: 2,
        overflow: "hidden",
      }}
    />
  );
};
