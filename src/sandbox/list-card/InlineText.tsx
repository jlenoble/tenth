import React, { FunctionComponent } from "react";
import { TextField, TextFieldProps } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { ErrorTooltip } from "../../core";

export interface InlineTextProps {
  text: string;
  edited?: boolean;
  label?: string;
  helperText?: string;
  error?: boolean;
  textFieldProps?: TextFieldProps;
}

export const InlineText: FunctionComponent<InlineTextProps> = ({
  text,
  edited,
  label,
  helperText,
  error,
  textFieldProps
}) => {
  if (edited && textFieldProps) {
    return (
      <TextField
        defaultValue={text}
        label={label}
        helperText={helperText}
        error={error}
        autoFocus
        fullWidth
        {...textFieldProps}
      />
    );
  }

  if (error) {
    const alert = (
      <Alert variant="outlined" severity="error">
        <AlertTitle>{text}</AlertTitle>
      </Alert>
    );

    return helperText ? (
      <ErrorTooltip title={helperText}>{alert}</ErrorTooltip>
    ) : (
      alert
    );
  }

  return <>{text}</>;
};

export default InlineText;
