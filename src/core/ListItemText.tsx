import React, { FunctionComponent } from "react";
import {
  ListItemText as MuiListItemText,
  ListItemTextProps as MuiListItemTextProps,
  TextFieldProps,
  TypographyVariant,
} from "@material-ui/core";
import { StatefulInlineText as InlineText } from "./InlineText";

export interface ListItemTextProps {
  primary: string;
  primaryVariant?: TypographyVariant;
  primaryLabel?: string;
  primaryHelperText?: string;
  primaryError?: boolean;
  primaryEnter?: (value: string) => void;
  primaryTextFieldProps?: TextFieldProps;
}

export type BaseListItemTextProps = Omit<MuiListItemTextProps, "primary">;
export type FullListItemTextProps = ListItemTextProps & BaseListItemTextProps;

export const ListItemText: FunctionComponent<FullListItemTextProps> = ({
  primary,
  primaryVariant = "body1",
  primaryLabel,
  primaryHelperText,
  primaryError,
  primaryEnter,
  primaryTextFieldProps,
  ...other
}) => {
  return primaryEnter ? (
    <MuiListItemText
      disableTypography
      primary={
        <InlineText
          text={primary}
          textClassName="MuiListItemText-primary"
          textVariant={primaryVariant}
          label={primaryLabel}
          helperText={primaryHelperText}
          error={primaryError}
          enter={primaryEnter}
          textFieldProps={primaryTextFieldProps}
        />
      }
      {...other}
    />
  ) : (
    <MuiListItemText primary={primary} {...other} />
  );
};

export default ListItemText;
