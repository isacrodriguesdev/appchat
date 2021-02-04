import * as React from "react"
import Svg, { Path, Rect } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: title */

function SvgComponent(props) {
  return (
    // @ts-ignore
    <Svg
      data-name="Camada 1"
      viewBox="0 0 64 64"
      width="1em"
      height="1em"
      {...props}
    >
      <Path d="M53.79 9A31.07 31.07 0 0031.2 0 32 32 0 000 31.2a30.44 30.44 0 008.79 22.12C15.51 60.21 25 64 35.42 64h18.09C58.73 64 64 60 64 51.05V33.28A34 34 0 0053.79 9zm4.94 42c0 5.36-1.38 7.68-5.22 7.68H35.42a30.17 30.17 0 01-22.57-9.39c-5-5.1-7.66-10.76-7.58-17.69C5.42 18.19 15.9 7 29.26 5.42A22 22 0 0132 5.27c7 0 12.67 2.76 17.85 7.81 5.67 5.53 8.92 12.26 8.92 20.2z" />
      <Rect x={16.08} y={34.6} width={18.05} height={5.93} rx={2.96} />
      <Path d="M44 21.8H19.24a3.11 3.11 0 00-3.16 2.83 3 3 0 003 3.1h24.69a3.1 3.1 0 003.16-2.83A3 3 0 0044 21.8z" />
    </Svg>
  )
}

export default SvgComponent