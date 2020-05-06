import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  KeyboardEvent,
} from "react";

// Dummy fix to help Babel:
// The exported identifier "_TextField" is not declared in Babel's scope tracker
// as a JavaScript value binding, and "@babel/plugin-transform-typescript"
// never encountered it as a TypeScript type declaration.
// It will be treated as a JavaScript value.
//
// This problem is likely caused by another plugin injecting
// "_TextField" without registering it in the scope tracker. If you are the author
//  of that plugin, please use "scope.registerDeclaration(declarationPath)".
import {
  TextField as MuiTextField,
  StandardTextFieldProps,
} from "@material-ui/core";
const TextField = MuiTextField;

export const useTextField = (
  initialValue: string,
  enter: (value: string) => void
) => {
  const [value, setValue] = useState(initialValue);

  const changeInput = (event: ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);

  const keyInput = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "Enter":
        enter(value);
        return true;

      case "Escape":
        enter(initialValue);
        return true;

      default:
        return false;
    }
  };

  return {
    value,
    changeInput,
    keyInput,
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
      onBlur={() => enter(defaultValue)}
      onKeyDown={keyInput}
      {...other}
    />
  );
};

export default TextField;
