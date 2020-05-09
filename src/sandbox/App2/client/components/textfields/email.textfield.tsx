import React, { FunctionComponent } from "react";
import { TextField, TextFieldProps } from "@material-ui/core";

export const EmailTextField: FunctionComponent<TextFieldProps> = ({
  autoFocus,
  margin,
}) => {
  return (
    <TextField
      variant="outlined"
      margin={margin}
      required
      fullWidth
      id="email"
      label="Email Address"
      name="email"
      autoComplete="email"
      autoFocus={autoFocus}
    />
  );
};

export default EmailTextField;
