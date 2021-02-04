import * as React from "react"
import Svg, { Path } from "react-native-svg"
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
      <Path
        d="M56.5 19.5L36 1.6a5.86 5.86 0 00-8 0L7.5 19.5a6.66 6.66 0 00-2.1 4.8v33.6a6 6 0 006.1 6.1h9.1a6 6 0 006.1-6.1V46.1a.74.74 0 01.8-.8h9.1a.74.74 0 01.8.8v11.7a6 6 0 006.1 6.1h9.1a6 6 0 006.1-6.1V24.3a6.39 6.39 0 00-2.2-4.8zm-3.2 38.4a.74.74 0 01-.8.8h-9.1a.74.74 0 01-.8-.8V46.1a6 6 0 00-6.1-6.1h-9.1a6 6 0 00-6.1 6.1v11.7a.74.74 0 01-.8.8h-9.1a.74.74 0 01-.8-.8V24.3c0-.3 0-.5.3-.5L31.5 5.9a.78.78 0 011.1 0L53 23.8c.3 0 .3.3.3.5v33.6z"
        data-name="Camada 2"
      />
    </Svg>
  )
}

export default SvgComponent