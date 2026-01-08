import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
export const GoogleLogo = (props) => (
  <Svg
    viewBox="-0.252 0 22 22"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid"
    fill="#000000"
    width={22}
    height={22}
    {...props}
  >
    <G id="SVGRepo_bgCarrier" strokeWidth={0} />
    <G
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <G id="SVGRepo_iconCarrier">
      <Path
        d="M21.486 11.206c0 -0.9 -0.074 -1.559 -0.232 -2.241H10.962v4.068h6.042c-0.123 1.011 -0.779 2.533 -2.241 3.556l-0.02 0.136 3.254 2.522 0.225 0.023c2.071 -1.912 3.264 -4.727 3.264 -8.064"
        fill="#4285F4"
      />
      <Path
        d="M10.962 21.925c2.961 0 5.444 -0.975 7.259 -2.655l-3.46 -2.68c-0.926 0.646 -2.169 1.097 -3.801 1.097 -2.898 0 -5.36 -1.912 -6.235 -4.556l-0.129 0.011 -3.384 2.619 -0.045 0.124c1.802 3.581 5.506 6.042 9.793 6.042"
        fill="#34A853"
      />
      <Path
        d="M4.727 13.131a6.769 6.769 0 0 1 -0.366 -2.169c0 -0.756 0.134 -1.486 0.354 -2.169l-0.006 -0.146 -3.427 -2.661 -0.113 0.053C0.426 7.527 0 9.196 0 10.962s0.426 3.435 1.169 4.92z"
        fill="#FBBC05"
      />
      <Path
        d="M10.962 4.238c2.058 0 3.446 0.889 4.238 1.632l3.094 -3.021C16.394 1.084 13.923 0 10.962 0 6.674 0 2.972 2.461 1.169 6.042l3.545 2.753C5.604 6.152 8.064 4.238 10.964 4.238"
        fill="#EB4335"
      />
    </G>
  </Svg>
);
