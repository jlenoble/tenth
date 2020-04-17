import React, { FunctionComponent, useState } from "react";
import { Typography } from "@material-ui/core";
import { StatefulTextField as TextField, TextFieldProps } from "./TextField";
import { Alert, AlertTitle } from "@material-ui/lab";
import { ErrorTooltip } from "./Tooltip";

export interface InlineTextProps {
  text: string;
  edited?: boolean;
  label?: string;
  helperText?: string;
  error?: boolean;
  edit: () => void;
  enter: (value: string) => void;
  textFieldProps?: TextFieldProps;
}

export const InlineText: FunctionComponent<InlineTextProps> = ({
  text,
  edited,
  label,
  helperText,
  error,
  edit,
  enter,
  textFieldProps
}) => {
  if (edited) {
    return (
      <TextField
        defaultValue={text}
        label={label}
        helperText={helperText}
        error={error}
        enter={enter}
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

  return (
    <Typography
      variant={"body1"}
      component="span"
      display="block"
      onClick={edit}
    >
      {text}
    </Typography>
  );
};

export const StatefulInlineText: FunctionComponent<Omit<
  InlineTextProps,
  "edited" | "edit"
>> = ({ text, label, helperText, error, enter, textFieldProps }) => {
  const [edited, setEdited] = useState(false);

  return (
    <InlineText
      text={text}
      edited={edited}
      label={label}
      helperText={helperText}
      error={error}
      edit={() => setEdited(true)}
      enter={(value: string) => {
        setEdited(false);
        enter(value);
      }}
      textFieldProps={textFieldProps}
    />
  );
};

export default InlineText;
