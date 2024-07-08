"use client";

import { ReactNode, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import InputField from "@beatattoos/ui/InputField";

/**
 * Props for {@link SearchClientField}
 */
interface SearchClientFieldProps {
  className?: string;
}

function SearchClientField(props: SearchClientFieldProps) {
  const [query, setQuery] = useState("");

  return (
    <InputField
      className={`col-span-2 ${props.className}`}
      placeholder={"Search for client..."}
      value={query}
      setValue={setQuery}
      id={"query"}
      inputPrependNode={<IconSearch className={"ml-3 h-5 w-5 flex-shrink-0"} />}
    />
  );
}

export default SearchClientField;
