import React, { FunctionComponent } from "react";
import { TextField, TextFieldProps } from "@material-ui/core";
import {
  BaseCardHeader,
  BaseCardHeaderPropsWithoutRef
} from "./BaseCardHeader";

export interface CardHeaderProps extends BaseCardHeaderPropsWithoutRef {
  title: string;
  titleTextFieldProps?: TextFieldProps;
}

export const CardHeader: FunctionComponent<CardHeaderProps> = ({
  disableTypography,
  classes,
  title,
  titleTypographyProps,
  titleTextFieldProps,
  ...other
}) => {
  if (titleTextFieldProps) {
    return (
      <BaseCardHeader
        disableTypography
        title={<TextField defaultValue={title} {...titleTextFieldProps} />}
        {...other}
      />
    );
  }

  return (
    <BaseCardHeader
      disableTypography={disableTypography}
      classes={classes}
      title={title}
      titleTypographyProps={titleTypographyProps}
      {...other}
    />
  );
};
