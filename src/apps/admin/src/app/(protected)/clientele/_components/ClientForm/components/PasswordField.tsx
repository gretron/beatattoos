import { useEffect, useRef, useState } from "react";
import { clientFormSchema } from "~/app/(protected)/clientele/_constants/schemas";
import {
  IconArrowsShuffle2,
  IconCheck,
  IconCopy,
  IconEyeClosed,
  IconEyeFilled,
} from "@tabler/icons-react";
import InputField from "@beatattoos/ui/InputField";
import { faker } from "@faker-js/faker";

/**
 * Props for {@link PasswordField}
 */
interface PasswordFieldProps {
  isPending?: boolean;
  value: string;
  setValue: (value: string) => void;
}

/**
 * Field for password on {@link ClientForm}
 */
function PasswordField(props: PasswordFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let timeoutCallback: number;

    if (isCopied) {
      timeoutCallback = setTimeout(
        () => setIsCopied(false),
        1000,
        "Reset Copy",
      );
    }

    return () => {
      clearTimeout(timeoutCallback);
    };
  }, [isCopied]);

  /**
   * Handle copy button click event
   */
  const handleCopyClick = () => {
    navigator.clipboard.writeText((inputRef.current as HTMLInputElement).value);
    setIsCopied(true);
  };

  return (
    <InputField
      ref={inputRef}
      id={"password"}
      type={isPasswordShown ? "text" : "password"}
      name={"password"}
      heading={"Password"}
      placeholder={"********"}
      schema={clientFormSchema.shape.password}
      disabled={props.isPending}
      required={true}
      value={props.value}
      setValue={props.setValue}
      inputWrapperClassName={"max-lg:grid"}
      inputContainerClassName={"max-lg:row-start-1"}
      fieldPrependNode={
        <button
          type={"button"}
          className={"btn-secondary"}
          disabled={props.isPending}
          onClick={() => props.setValue(faker.internet.password())}
        >
          <IconArrowsShuffle2 className={"h-5 w-5"} />
          Randomize
        </button>
      }
      inputPrependNode={
        <button
          type={"button"}
          className={"btn-neutral__icon z-10 rounded-l-[15px] rounded-r-none"}
          disabled={props.isPending}
          onClick={() => setIsPasswordShown(!isPasswordShown)}
        >
          {isPasswordShown ? (
            <IconEyeFilled className={"h-5 w-5"} />
          ) : (
            <IconEyeClosed className={"h-5 w-5"} />
          )}
        </button>
      }
      inputAppendNode={
        <button
          type={"button"}
          className={"btn-neutral z-10 rounded-l-none rounded-r-[15px]"}
          disabled={props.isPending}
          onClick={handleCopyClick}
        >
          {isCopied ? (
            <>
              <IconCheck className={"h-5 w-5"} />
              <span className={"max-lg:hidden"}>Copied</span>
            </>
          ) : (
            <>
              <IconCopy className={"h-5 w-5"} />
              <span className={"max-lg:hidden"}>Copy</span>
            </>
          )}
        </button>
      }
    />
  );
}

export default PasswordField;
