import React, { FunctionComponent } from "react";
import { TextField, TextFieldProps } from "@material-ui/core";

export const PasswordTextField: FunctionComponent<TextFieldProps> = ({
  autoFocus,
  margin,
}) => {
  return (
    <TextField
      variant="outlined"
      margin={margin}
      required
      fullWidth
      id="password"
      label="Password"
      name="password"
      type="password"
      autoComplete="current-password"
      autoFocus={autoFocus}
    />
  );
};

export default PasswordTextField;
