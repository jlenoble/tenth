import React, { FunctionComponent } from "react";
import {
  CardHeader as MuiCardHeader,
  CardHeaderProps as MuiCardHeaderProps,
  TextFieldProps
} from "@material-ui/core";
import InlineText from "./InlineText";

export interface CardHeaderProps {
  title: string;
  titleEdited?: boolean;
  titleLabel?: string;
  titleHelperText?: string;
  titleError?: boolean;
  titleTextFieldProps?: TextFieldProps;
}

export type BaseCardHeaderProps = Omit<MuiCardHeaderProps, "title">;
export type FullCardHeaderProps = CardHeaderProps & BaseCardHeaderProps;

export const CardHeader: FunctionComponent<FullCardHeaderProps> = ({
  title,
  titleEdited,
  titleLabel,
  titleHelperText,
  titleError,
  titleTextFieldProps,
  ...other
}) => {
  return (
    <MuiCardHeader
      disableTypography={titleEdited || titleError}
      title={
        <InlineText
          text={title}
          edited={titleEdited}
          label={titleLabel}
          helperText={titleHelperText}
          error={titleError}
          textFieldProps={titleTextFieldProps}
        />
      }
      {...other}
    />
  );
};
