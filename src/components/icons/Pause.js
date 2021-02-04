import * as React from "react"
import Svg, { Path } from "react-native-svg"

function SvgComponent(props) {
  return (
    <Svg height="1em" viewBox="-45 0 327 327" width="1em" {...props}>
      <Path d="M158 0h71a8 8 0 018 8v311a8 8 0 01-8 8h-71a8 8 0 01-8-8V8a8 8 0 018-8zm0 0M8 0h71a8 8 0 018 8v311a8 8 0 01-8 8H8a8 8 0 01-8-8V8a8 8 0 018-8zm0 0" />
    </Svg>
  )
}

export default SvgComponent
