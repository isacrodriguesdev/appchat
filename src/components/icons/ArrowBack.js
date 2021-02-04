import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg
      width="1em"
      height="1em"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path d="M13.281 6.781l-8.5 8.5-.687.719.687.719 8.5 8.5 1.438-1.438L7.938 17H28v-2H7.937l6.782-6.781z" />
    </Svg>
  )
}

export default SvgComponent
