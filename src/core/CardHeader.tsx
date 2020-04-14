import React, { FunctionComponent } from "react";
import {
  CardHeader as BaseCardHeader,
  CardHeaderProps as BaseCardHeaderProps,
  TextFieldProps
} from "@material-ui/core";
import InlineText from "./InlineText";

export interface CardHeaderProps extends BaseCardHeaderProps {
  title: string;
  titleEdited?: boolean;
  titleLabel?: string;
  titleHelperText?: string;
  titleError?: boolean;
  titleTextFieldProps?: TextFieldProps;
}

export const CardHeader: FunctionComponent<CardHeaderProps> = ({
  title,
  titleEdited,
  titleLabel,
  titleHelperText,
  titleError,
  titleTextFieldProps,
  ...other
}) => {
  return (
    <BaseCardHeader
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
