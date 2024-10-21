import * as React from "react";
import { Text, View } from "react-native";
import Svg, {
  Defs,
  Ellipse,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

import { type TModelVibefireEvent } from "@vibefire/models";

export const EventIcon = ({
  vibeIndex,
  sizeFactor = 0.12,
}: {
  vibeIndex: TModelVibefireEvent["vibe"];
  sizeFactor?: number;
}) => (
  <Svg
    fill="none"
    viewBox="0 0 400 500"
    height={500 * sizeFactor}
    width={400 * sizeFactor}
  >
    <Ellipse
      cx={200}
      cy={475.5}
      fill="#A9A9A9"
      fillOpacity={0.5}
      rx={50}
      ry={12.5}
    />
    <Path
      fill="url(#a)"
      stroke="#000"
      d="M140.95 83.47 104 34l86.235 397.042c2.281 10.502 17.26 10.504 19.544.003L295.5 36.981l-19.513 10.19-7.8-7.324H254.05l-12.675-6.369v-14.01l9.262-5.413 8.775 5.413 2.925 4.458 10.725 1.91 6.338-6.368-6.338-5.413-13.65-4.776h-27.787l-11.213 24.2 20.963 13.691 12.675 5.413 8.287 17.832-16.575 9.234-11.7-11.145-24.375 14.966 10.725 5.731 6.825-9.552 6.825 11.781-18.525 15.921h-25.35l-15.6-15.92 15.6-7.961 10.238-7.642 9.262-12.418 5.85-16.24-15.112-18.468h-20.963l-7.8 11.145 10.725 7.323 3.413-10.189 10.725 15.602L185.8 63.41l-14.138 1.91-8.775-22.926 8.775-25.155-15.6-12.736L131.2 1l-20.475 5.731 30.225 21.971V83.47Z"
    />
    <Path
      fill="url(#b)"
      stroke="#000"
      d="M307.709 21H400c-48.906 0-49.976 0-190.364 449.167-2.924 9.356-16.348 9.356-19.272 0C49.976 21 48.906 21 0 21h92.291a10 10 0 0 1 9.671 7.455l88.367 335.796c2.616 9.94 16.726 9.94 19.342 0l88.367-335.796A10 10 0 0 1 307.709 21Z"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={200}
        x2={200}
        y1={1}
        y2={405.5}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="red" />
        <Stop offset={0.578} stopColor="#FFB800" />
        <Stop offset={1} stopColor="#fff" />
      </LinearGradient>
      <LinearGradient
        id="b"
        x1={200}
        x2={200}
        y1={21}
        y2={501}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#591FFF" />
        <Stop offset={1} stopColor="#1FA1FF" stopOpacity={0.9} />
      </LinearGradient>
    </Defs>
  </Svg>
);

export const ClusterIcon = ({ pointCount }: { pointCount: number }) => (
  <View
    style={{
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0,0,0,0.9)",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ color: "white", fontWeight: "bold" }}>{pointCount}</Text>
  </View>
);
