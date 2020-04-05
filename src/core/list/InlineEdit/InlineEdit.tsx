import React from "react";
import TextField from "@material-ui/core/TextField";
import ListItemText from "@material-ui/core/ListItemText";
import { StatelessInlineEdit } from "../../stateful";

export const InlineEdit: StatelessInlineEdit = ({
  inputValue,
  edited,
  changeInput,
  keyInput,
  edit,
  stopEditing,
}) => {
  if (edited) {
    return (
      <TextField
        defaultValue={inputValue}
        autoFocus
        fullWidth
        onChange={changeInput}
        onBlur={stopEditing}
        onKeyPress={keyInput}
      />
    );
  }

  return <ListItemText primary={inputValue} onClick={edit} />;
};
