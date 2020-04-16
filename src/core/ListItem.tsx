import React, { FunctionComponent } from "react";
import {
  ListItem as MuiListItem,
  ListItemProps as MuiListItemProps,
  Checkbox,
  CheckboxProps,
  IconButton,
  IconButtonProps
} from "@material-ui/core";
import { DeleteOutlined } from "@material-ui/icons";
import {
  ListItemText,
  ListItemTextProps,
  BaseListItemTextProps
} from "./ListItemText";

export interface ListItemProps extends ListItemTextProps {
  itemId: string;
  checked?: boolean;
  checkboxProps?: Omit<CheckboxProps, "checked">;
  listItemTextProps?: BaseListItemTextProps;
  deleteButtonProps?: IconButtonProps;
}

export type BaseListItemProps = MuiListItemProps<"li", { button?: false }>;
export type FullListItemProps = ListItemProps & BaseListItemProps;

export const ListItem: FunctionComponent<FullListItemProps> = ({
  itemId,

  checked,
  checkboxProps,

  primary,
  primaryEdited,
  primaryLabel,
  primaryHelperText,
  primaryError,
  primaryTextFieldProps,
  listItemTextProps,

  deleteButtonProps,

  ...other
}) => {
  return (
    <MuiListItem {...other}>
      {checkboxProps && <Checkbox checked={checked} {...checkboxProps} />}
      <ListItemText
        primary={primary}
        primaryEdited={primaryEdited}
        primaryLabel={primaryLabel}
        primaryHelperText={primaryHelperText}
        primaryError={primaryError}
        primaryTextFieldProps={primaryTextFieldProps}
        {...listItemTextProps}
      />
      {deleteButtonProps && (
        <IconButton aria-label="Delete item" {...deleteButtonProps}>
          <DeleteOutlined />
        </IconButton>
      )}
    </MuiListItem>
  );
};

export default ListItem;
