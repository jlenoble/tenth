import React, { FunctionComponent, ReactElement } from "react";
import {
  IconButton,
  IconButtonProps as BaseIconButtonProps,
} from "@material-ui/core";
import {
  AddOutlined,
  CloseOutlined,
  DeleteOutlined,
  OpenInNewOutlined,
} from "@material-ui/icons";
import { CatchError } from "./catch-error";

export const buttonLabels = {
  add: "Add item",
  close: "Close item",
  delete: "Delete item",
  openInNew: "Expand item",
};

export const buttonComponents = {
  add: AddOutlined,
  close: CloseOutlined,
  delete: DeleteOutlined,
  openInNew: OpenInNewOutlined,
};

export interface IconButtonProps extends BaseIconButtonProps {
  catchError?: CatchError;
}

export const makeButton = (
  label: string,
  IconComponent: FunctionComponent
): FunctionComponent<IconButtonProps> => {
  const Component: FunctionComponent<IconButtonProps> = ({
    onClick,
    catchError,
    ...other
  }): ReactElement => {
    return (
      <IconButton
        aria-label={label}
        onClick={catchError && onClick ? catchError(onClick) : onClick}
        {...other}
      >
        <IconComponent />
      </IconButton>
    );
  };

  Component.displayName = label[0].toUpperCase() + label.slice(1) + "Button";

  return Component;
};

export const AddButton = makeButton(buttonLabels.add, buttonComponents.add);
export const CloseButton = makeButton(
  buttonLabels.close,
  buttonComponents.close
);
export const DeleteButton = makeButton(
  buttonLabels.delete,
  buttonComponents.delete
);
export const OpenInNewButton = makeButton(
  buttonLabels.openInNew,
  buttonComponents.openInNew
);
