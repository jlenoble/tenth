import React, { FunctionComponent, memo } from "react";
import { Checkbox, CheckboxProps } from "@material-ui/core";
import {
  ListItem as MuiListItem,
  ListItemProps as MuiListItemProps,
} from "../mui-base";
import {
  ListItemText,
  ListItemTextProps,
  BaseListItemTextProps,
} from "./ListItemText";
import { DeleteButton, OpenInNewButton, IconButtonProps } from "./buttons";
import { CatchError } from "./ErrorFeedback";

export interface ListItemProps extends ListItemTextProps {
  itemId: string;
  checked?: boolean;
  checkboxProps?: Omit<CheckboxProps, "checked">;
  listItemTextProps?: BaseListItemTextProps;
  deleteButtonProps?: IconButtonProps;
  expandButtonProps?: IconButtonProps;
  catchError?: CatchError;

  // Special prop to force refresh:
  // The behaviour of buttons may change depending on
  // surrounding elements (open or not new stuff if some are here or not).
  // Simpling equaling on visible content or own className would leave
  // the UI in an inconsistent state if the ListItem were not forced to update.
  "data-view-key"?: string;
}

export type BaseListItemProps = MuiListItemProps;
export type FullListItemProps = ListItemProps & BaseListItemProps;

const ListItem: FunctionComponent<FullListItemProps> = ({
  itemId, // eslint-disable-line @typescript-eslint/no-unused-vars
  "data-view-key": viewKey, // eslint-disable-line @typescript-eslint/no-unused-vars

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

  catchError,

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
      {expandButtonProps && (
        <OpenInNewButton {...expandButtonProps} catchError={catchError} />
      )}
      {deleteButtonProps && (
        <DeleteButton {...deleteButtonProps} catchError={catchError} />
      )}
    </MuiListItem>
  );
};

const MemoizedListItem = memo(ListItem, (prevProps, nextProps) => {
  let eq =
    prevProps.itemId === nextProps.itemId &&
    prevProps.primary === nextProps.primary &&
    prevProps.checked === nextProps.checked &&
    prevProps["data-view-key"] === nextProps["data-view-key"];

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
