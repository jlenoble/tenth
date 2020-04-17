import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  KeyboardEvent
} from "react";
import { TextField, StandardTextFieldProps } from "@material-ui/core";

export const useTextField = (
  initialValue: string,
  enter: (value: string) => void
) => {
  const [value, setValue] = useState(initialValue);

  const changeInput = (event: ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);

  const keyInput = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      enter(value);
      return true;
    }

    return false;
  };

  return {
    value,
    changeInput,
    keyInput
  };
};

export interface StatefulTextFieldProps extends StandardTextFieldProps {
  defaultValue?: string;
  enter: (value: string) => void;
}

export type TextFieldProps = Omit<
  StandardTextFieldProps,
  "defaultValue" | "variant"
>;

export const StatefulTextField: FunctionComponent<StatefulTextFieldProps> = ({
  defaultValue = "",
  enter,
  ...other
}) => {
  const { value, changeInput, keyInput } = useTextField(defaultValue, enter);

  return (
    <TextField
      variant="standard"
      autoFocus
      fullWidth
      value={value}
      onChange={changeInput}
      onBlur={() => enter(value)}
      onKeyPress={keyInput}
      {...other}
    />
  );
};

export default TextField;
