import { ReactNode } from "react";

/**
 * Props for {@link InformationLine}
 */
interface InformationLineProps {
  className?: string;
  heading: string;
  text?: string;
  prependNode?: ReactNode;
  appendNode?: ReactNode;
}

/**
 * Line to display information
 */
export default function InformationLine(props: InformationLineProps) {
  return (
    <div className={props.className}>
      <h5 className={"mb-1"}>{props.heading}</h5>
      <div className={"border border-neutral-400 rounded-2xl flex"}>
        {props.prependNode}
        <span className={"grow p-3 truncate"}>{props.text}</span>
        {props.appendNode}
      </div>
    </div>
  );
}
