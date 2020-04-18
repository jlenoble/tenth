import React, { FunctionComponent, memo } from "react";
import {
  Checkbox,
  CheckboxProps,
  IconButton,
  IconButtonProps
} from "@material-ui/core";
import { DeleteOutlined } from "@material-ui/icons";
import {
  ListItem as MuiListItem,
  ListItemProps as MuiListItemProps
} from "../mui-base";
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

export type BaseListItemProps = MuiListItemProps;
export type FullListItemProps = ListItemProps & BaseListItemProps;

export const ListItem: FunctionComponent<FullListItemProps> = memo(
  ({
    itemId,

    checked,
    checkboxProps,

    primary,
    primaryLabel,
    primaryHelperText,
    primaryError,
    primaryEnter,
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
          primaryLabel={primaryLabel}
          primaryHelperText={primaryHelperText}
          primaryError={primaryError}
          primaryEnter={primaryEnter}
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
  },
  (prevProps, nextProps) => {
    let eq =
      prevProps.itemId === nextProps.itemId &&
      prevProps.primary === nextProps.primary &&
      prevProps.checked === nextProps.checked;

    const pdp = prevProps.draggableProps;
    const ndp = nextProps.draggableProps;

    if (pdp && ndp) {
      eq = eq && pdp.index === ndp.index;
    } else {
      eq = eq && pdp === ndp;
    }

    return eq;
  }
);

export default ListItem;
