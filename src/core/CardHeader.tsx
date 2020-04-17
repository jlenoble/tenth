import React, { FunctionComponent } from "react";
import {
  CardHeader as MuiCardHeader,
  CardHeaderProps as MuiCardHeaderProps,
  TextFieldProps,
  TypographyVariant
} from "@material-ui/core";
import { StatefulInlineText as InlineText } from "./InlineText";

export interface CardHeaderProps {
  title: string;
  titleVariant?: TypographyVariant;
  titleLabel?: string;
  titleHelperText?: string;
  titleError?: boolean;
  titleEnter?: (title: string) => void;
  titleTextFieldProps?: TextFieldProps;
}

export type BaseCardHeaderProps = Omit<MuiCardHeaderProps, "title">;
export type FullCardHeaderProps = CardHeaderProps & BaseCardHeaderProps;

export const CardHeader: FunctionComponent<FullCardHeaderProps> = ({
  title,
  titleVariant = "h5",
  titleLabel,
  titleHelperText,
  titleError,
  titleEnter,
  titleTextFieldProps,
  ...other
}) => {
  return titleEnter ? (
    <MuiCardHeader
      disableTypography
      title={
        <InlineText
          text={title}
          textVariant={titleVariant}
          label={titleLabel}
          helperText={titleHelperText}
          error={titleError}
          enter={titleEnter}
          textFieldProps={titleTextFieldProps}
        />
      }
      {...other}
    />
  ) : (
    <MuiCardHeader title={title} {...other} />
  );
};

export default CardHeader;
