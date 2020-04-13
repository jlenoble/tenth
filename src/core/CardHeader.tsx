import React, { FunctionComponent } from "react";
import { TextFieldProps } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import {
  CardHeader as BaseCardHeader,
  CardHeaderProps as BaseCardHeaderProps
} from "../mui-base";
import { ErrorTooltip } from "./Tooltip";

export interface CardHeaderProps extends BaseCardHeaderProps {
  titleLabel?: string;
  titleHelperText?: string;
  titleTextFieldProps?: TextFieldProps;
  error?: boolean;
}

export const CardHeader: FunctionComponent<CardHeaderProps> = ({
  disableTypography,
  title,
  titleLabel = "Title",
  titleHelperText,
  titleTextFieldProps,
  error,
  ...other
}) => {
  return (
    <BaseCardHeader
      disableTypography={disableTypography || error}
      title={
        titleTextFieldProps || !error ? (
          title
        ) : (
          <ErrorTooltip title={titleHelperText || "Invalid title"}>
            <Alert variant="outlined" severity="error">
              <AlertTitle>{title}</AlertTitle>
            </Alert>
          </ErrorTooltip>
        )
      }
      titleTextFieldProps={
        titleTextFieldProps && {
          ...titleTextFieldProps,
          error,
          helperText: titleHelperText,
          label: titleLabel,
          required: true
        }
      }
      {...other}
    />
  );
};
