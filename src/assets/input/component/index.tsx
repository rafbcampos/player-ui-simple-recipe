import React from "react";
import type { TransformedInput } from "../types";
import { useInputProps } from "../hooks";
import { ReactAsset } from "@player-ui/react";

export const InputComponent = (props: TransformedInput) => {
  const { validation, label, id, placeholder } = props;
  const inputProps = useInputProps(props);

  return (
    <div>
      {label && (
        <label htmlFor={id}>
          <ReactAsset {...label.asset} />
        </label>
      )}
      <input id={id} {...inputProps} placeholder={placeholder} />
      {validation && <span>{validation.message}</span>}
    </div>
  );
};
