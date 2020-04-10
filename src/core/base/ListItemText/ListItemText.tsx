import React, { FunctionComponent, useContext } from "react";
import { Typography, TextField, TextFieldProps } from "@material-ui/core";
import ListContext from "@material-ui/core/List/ListContext";
import {
  BaseListItemText,
  BaseListItemTextPropsWithoutRef
} from "./BaseListItemText";

export interface ListItemTextProps extends BaseListItemTextPropsWithoutRef {
  primary: string;
  secondary?: string;
  primaryTextFieldProps?: TextFieldProps;
  secondaryTextFieldProps?: TextFieldProps;
}

export const ListItemText: FunctionComponent<ListItemTextProps> = ({
  disableTypography,
  classes,
  primary,
  primaryTypographyProps,
  primaryTextFieldProps,
  secondary,
  secondaryTypographyProps,
  secondaryTextFieldProps,
  ...other
}) => {
  const { dense } = useContext(ListContext);

  if (primaryTextFieldProps) {
    return (
      <BaseListItemText
        disableTypography
        primary={
          <TextField defaultValue={primary} {...primaryTextFieldProps} />
        }
        secondary={
          disableTypography
            ? secondary
            : secondary && (
                <Typography
                  variant="body2"
                  className={classes?.secondary}
                  color="textSecondary"
                  display="block"
                  {...secondaryTypographyProps}
                >
                  {secondary}
                </Typography>
              )
        }
        {...other}
      />
    );
  }

  if (secondaryTextFieldProps) {
    return (
      <BaseListItemText
        disableTypography
        primary={
          disableTypography ? (
            primary
          ) : (
            <Typography
              variant={dense ? "body2" : "body1"}
              className={classes?.primary}
              component="span"
              display="block"
              {...primaryTypographyProps}
            >
              {primary}
            </Typography>
          )
        }
        secondary={
          <TextField defaultValue={secondary} {...secondaryTextFieldProps} />
        }
        {...other}
      />
    );
  }

  return (
    <BaseListItemText
      disableTypography={disableTypography}
      classes={classes}
      primary={primary}
      secondary={secondary}
      primaryTypographyProps={primaryTypographyProps}
      secondaryTypographyProps={secondaryTypographyProps}
      {...other}
    />
  );
};
