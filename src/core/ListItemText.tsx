import React, { FunctionComponent } from "react";
import {
  ListItemText as MuiListItemText,
  ListItemTextProps as MuiListItemTextProps,
  TextFieldProps
} from "@material-ui/core";
import InlineText from "./InlineText";

export interface ListItemTextProps {
  primary: string;
  primaryEdited?: boolean;
  primaryLabel?: string;
  primaryHelperText?: string;
  primaryError?: boolean;
  primaryTextFieldProps?: TextFieldProps;
}

export type BaseListItemTextProps = Omit<MuiListItemTextProps, "primary">;
export type FullListItemTextProps = ListItemTextProps & BaseListItemTextProps;

export const ListItemText: FunctionComponent<FullListItemTextProps> = ({
  primary,
  primaryEdited,
  primaryLabel,
  primaryHelperText,
  primaryError,
  primaryTextFieldProps,
  ...other
}) => {
  return (
    <MuiListItemText
      disableTypography={
        (primaryTextFieldProps && primaryEdited) || primaryError
      }
      primary={
        <InlineText
          text={primary}
          edited={primaryEdited}
          label={primaryLabel}
          helperText={primaryHelperText}
          error={primaryError}
          textFieldProps={primaryTextFieldProps}
        />
      }
      {...other}
    />
  );
};
