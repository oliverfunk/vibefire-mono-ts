import * as React from "react";
import { Text, View } from "react-native";
import Svg, { SvgXml } from "react-native-svg";

import { type VibefireEventT } from "@vibefire/models";

const vfRegularEventIcon = `
<svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
<ellipse cx="200" cy="474.5" rx="50" ry="12.5" fill="#A9A9A9" fill-opacity="0.5"/>
<path d="M140.95 82.4699L104 33L190.235 430.042C192.516 440.544 207.495 440.546 209.779 430.045L295.5 35.9811L275.987 46.1704L268.187 38.8468H254.05L241.375 32.4785V18.4682L250.637 13.0551L259.412 18.4682L262.337 22.926L273.062 24.8365L279.4 18.4682L273.062 13.0551L259.412 8.27883H231.625L220.412 32.4785L241.375 46.1704L254.05 51.5835L262.337 69.4148L245.762 78.6489L234.062 67.5043L209.687 82.4699L220.412 88.2014L227.237 78.6489L234.062 90.4303L215.537 106.351H190.187L174.587 90.4303L190.187 82.4699L200.425 74.8279L209.687 62.4096L215.537 46.1704L200.425 27.7022H179.462L171.662 38.8468L182.387 46.1704L185.8 35.9811L196.525 51.5835L185.8 62.4096L171.662 64.3201L162.887 41.3941L171.662 16.2392L156.062 3.50258L131.2 0L110.725 5.7315L140.95 27.7022V82.4699Z" fill="url(#paint0_linear_201_6)"/>
<path d="M307.709 20L400 20C351.094 20 350.024 20 209.636 469.167C206.712 478.523 193.288 478.523 190.364 469.167C49.976 20 48.9056 20 0 20H92.2911C96.8338 20 100.806 23.062 101.962 27.4551L190.329 363.251C192.945 373.191 207.055 373.191 209.671 363.251L298.038 27.4551C299.194 23.0619 303.166 20 307.709 20Z" fill="url(#paint1_linear_201_6)"/>
<defs>
<linearGradient id="paint0_linear_201_6" x1="200" y1="0" x2="200" y2="404.5" gradientUnits="userSpaceOnUse">
<stop stop-color="#FF0000"/>
<stop offset="0.578125" stop-color="#FFB800"/>
<stop offset="1" stop-color="white"/>
</linearGradient>
<linearGradient id="paint1_linear_201_6" x1="200" y1="20" x2="200" y2="500" gradientUnits="userSpaceOnUse">
<stop stop-color="#591FFF"/>
<stop offset="1" stop-color="#1FA1FF" stop-opacity="0.9"/>
</linearGradient>
</defs>
</svg>
`;
export const EventIcon = ({
  vibeIndex,
}: {
  vibeIndex: VibefireEventT["vibe"];
}) => (
  <Svg height="50" width="50" viewBox="0 0 100 100">
    <SvgXml xml={vibeIndex == 0 ? vfRegularEventIcon : vfRegularEventIcon} />
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
