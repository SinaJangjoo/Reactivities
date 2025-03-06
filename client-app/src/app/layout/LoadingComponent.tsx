import { Dimmer, Loader } from "semantic-ui-react";

interface Props {
  inverted?: boolean; //for darken or light the background or even give a full screen position
  content?: string; //for loading content for eg. write the word "loading..."
}

export default function LoadingComponent({
  inverted = true,
  content = "Loading...",
}: Props) {
  return (
    <Dimmer active={true} inverted={inverted}>
        <Loader content={content}/>
    </Dimmer>
  )
}
