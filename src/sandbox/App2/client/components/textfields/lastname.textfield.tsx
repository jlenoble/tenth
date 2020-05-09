import React, { FunctionComponent } from "react";
import { TextField, TextFieldProps } from "@material-ui/core";

export const LastNameTextField: FunctionComponent<TextFieldProps> = ({
  autoFocus,
  margin,
}) => {
  return (
    <TextField
      variant="outlined"
      margin={margin}
      required
      fullWidth
      id="lastName"
      label="Last Name"
      name="lastName"
      autoComplete="lname"
      autoFocus={autoFocus}
    />
  );
};

export default LastNameTextField;
