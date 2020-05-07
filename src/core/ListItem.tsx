import React, { FunctionComponent, memo } from "react";
import { Checkbox, CheckboxProps, IconButtonProps } from "@material-ui/core";
import {
  ListItem as MuiListItem,
  ListItemProps as MuiListItemProps,
} from "../mui-base";
import {
  ListItemText,
  ListItemTextProps,
  BaseListItemTextProps,
} from "./ListItemText";
import { DeleteButton, OpenInNewButton } from "./buttons";

export interface ListItemProps extends ListItemTextProps {
  checked?: boolean;
  checkboxProps?: Omit<CheckboxProps, "checked">;
  listItemTextProps?: BaseListItemTextProps;
  deleteButtonProps?: IconButtonProps;
  expandButtonProps?: IconButtonProps;
}

export type BaseListItemProps = MuiListItemProps;
export type FullListItemProps = ListItemProps & BaseListItemProps;

const ListItem: FunctionComponent<FullListItemProps> = ({
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
  expandButtonProps,

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
      {expandButtonProps && <OpenInNewButton {...expandButtonProps} />}
      {deleteButtonProps && <DeleteButton {...deleteButtonProps} />}
    </MuiListItem>
  );
};

const MemoizedListItem = memo(ListItem, (prevProps, nextProps) => {
  let eq =
    prevProps.key === nextProps.key &&
    prevProps.primary === nextProps.primary &&
    prevProps.checked === nextProps.checked;

  const pdp = prevProps.draggableProps;
  const ndp = nextProps.draggableProps;

  if (pdp && ndp) {
    eq = eq && pdp.draggableId === ndp.draggableId;
  } else {
    eq = eq && pdp === ndp;
  }

  const pep = prevProps.expandButtonProps;
  const nep = nextProps.expandButtonProps;

  if (pep && nep) {
    eq = eq && pep.className === nep.className;
  } else {
    eq = eq && pep === nep;
  }

  return eq;
});

export { MemoizedListItem as ListItem };
export default MemoizedListItem;
