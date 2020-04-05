import React from "react";
import { ListItemText } from "../../base";
import { StatelessInlineEdit } from "../../stateful";

export const InlineEdit: StatelessInlineEdit = ({
  inputValue,
  edited,
  changeInput,
  keyInput,
  edit,
  stopEditing
}) => {
  const props = edited
    ? {
        primaryTextFieldProps: {
          autoFocus: true,
          fullWidth: true,
          onChange: changeInput,
          onBlur: stopEditing,
          onKeyPress: keyInput
        }
      }
    : { onClick: edit };

  return <ListItemText primary={inputValue} {...props} />;
};
