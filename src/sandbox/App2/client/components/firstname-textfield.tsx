import React, { FunctionComponent } from "react";
import { TextField, TextFieldProps } from "@material-ui/core";

export const FirstNameTextField: FunctionComponent<TextFieldProps> = ({
  autoFocus,
  margin,
}) => {
  return (
    <TextField
      variant="outlined"
      margin={margin}
      required
      fullWidth
      id="firstName"
      label="First Name"
      name="firstName"
      autoComplete="fname"
      autoFocus={autoFocus}
    />
  );
};

export default FirstNameTextField;
