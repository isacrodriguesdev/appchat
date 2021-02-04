import React from 'react'

export default function Rendering(props: { render: boolean | number | null | undefined, children?: any }) {
   return props.render ? props.children : null
}
