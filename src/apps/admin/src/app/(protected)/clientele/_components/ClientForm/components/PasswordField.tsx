import { useEffect, useRef, useState } from "react";
import {
  IconArrowsShuffle2,
  IconCheck,
  IconCopy,
  IconEyeClosed,
  IconEyeFilled,
} from "@tabler/icons-react";
import { InputField } from "@beatattoos/ui";
import { faker } from "@faker-js/faker";
import { passwordSchema } from "~/app/_constants/schemas";
import CopyButton from "~/app/(protected)/_components/CopyButton";

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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputField
      ref={inputRef}
      id={"password"}
      type={showPassword ? "text" : "password"}
      name={"password"}
      heading={"Password"}
      placeholder={"********"}
      schema={passwordSchema}
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
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <IconEyeFilled className={"h-5 w-5"} />
          ) : (
            <IconEyeClosed className={"h-5 w-5"} />
          )}
        </button>
      }
      inputAppendNode={
        <CopyButton value={props.value} className={"rounded-l-none"} />
      }
    />
  );
}

export default PasswordField;
