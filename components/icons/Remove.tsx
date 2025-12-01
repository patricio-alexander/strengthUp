import { useColors } from "@/hooks/useColors";
import Svg, { G, Path, SvgProps } from "react-native-svg";
export const Remove = (props: SvgProps) => {
  const { icon } = useColors();
  return (
    <Svg viewBox="0 0 24 24" fill="none" width={24} height={24} {...props}>
      <G id="SVGRepo_bgCarrier" strokeWidth={0} />
      <G
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <G id="SVGRepo_iconCarrier">
        <Path
          d="m12 9.5 5 5m0 -5 -5 5m-7.492 -0.545 2.932 3.8c0.352 0.457 0.528 0.685 0.75 0.85a2 2 0 0 0 0.652 0.32c0.266 0.075 0.554 0.075 1.131 0.075H17.8c1.12 0 1.68 0 2.108 -0.218a2 2 0 0 0 0.874 -0.874C21 17.48 21 16.92 21 15.8V8.2c0 -1.12 0 -1.68 -0.218 -2.108a2 2 0 0 0 -0.874 -0.874C19.481 5 18.92 5 17.8 5H9.973c-0.577 0 -0.865 0 -1.13 0.075a2 2 0 0 0 -0.653 0.32c-0.222 0.165 -0.398 0.393 -0.75 0.85l-2.932 3.8c-0.54 0.7 -0.81 1.05 -0.913 1.435a2 2 0 0 0 0 1.04c0.104 0.385 0.374 0.735 0.913 1.435"
          stroke={icon}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
    </Svg>
  );
};
