import React, { useEffect } from 'react';
// imports
// types
// components
import MessageText from './Stacks/MessageText';
import MessageImage from './Stacks/MessageImage';
import MessageAudio from './Stacks/MessageAudio';
import MessageDocument from './Stacks/MessageDocument';

interface Props {
  type: string
  file: string
}

export default function Message(props: Props) {

  if (props.type === "chat")
    return <MessageText {...props} />

  else if (["image"].includes(props.type) || props.type.split("/")[0] === "image")
    return <MessageImage {...props} />

  // else if (["video"].includes(props.type) || props.type.split("/")[0] === "video")
  //   return <MessageVideo {...props} />

  else if (["ptt", "audio"].includes(props.type) || props.type.split("/")[0] === "audio")
    return <MessageAudio {...props} />

  else if (props.type.split("/"))
    return <MessageDocument {...props} />

  else
    return <MessageText {...props} />
}