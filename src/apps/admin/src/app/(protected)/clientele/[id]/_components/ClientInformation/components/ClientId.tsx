import { AnimatedIconCheck, useCopy } from "@beatattoos/ui";
import { IconCopy } from "@tabler/icons-react";

/**
 * Props for {@link ClientId}
 */
interface ClientIdProps {
  id: string;
}

/**
 * Copyable client id
 */
export default function ClientId(props: ClientIdProps) {
  const { isCopied, handleCopyClick } = useCopy(props.id);

  return (
    <h3
      className={
        "group mb-6 flex cursor-pointer items-center gap-1 text-neutral-500"
      }
      onClick={handleCopyClick}
    >
      <span className={"select-none"}># </span>
      <span className={"break-all"}>{props.id}</span>
      {isCopied ? (
        <AnimatedIconCheck className={"h-5 w-5 flex-shrink-0"} />
      ) : (
        <IconCopy
          className={
            "h-5 w-5 flex-shrink-0 transition group-hover:opacity-100 md:opacity-0"
          }
        />
      )}
    </h3>
  );
}
