import React, { FunctionComponent } from "react";
import { ItemHooks } from "./types";
import { useInputValue } from "../states";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

export type AddItemProps = {
  tmpId: () => string;
  itemHooks: ItemHooks;
};

export const AddItem: FunctionComponent<AddItemProps> = ({
  tmpId,
  itemHooks
}) => {
  const { addItem } = itemHooks;
  const add = (value: string) => {
    addItem &&
      addItem({
        id: tmpId(),
        text: value,
        checked: false,
        edited: false
      });
  };

  const { inputValue, changeInput, keyInput, clearInputAndAdd } = useInputValue(
    add
  );

  return (
    <Paper style={{ margin: 16, padding: 16 }}>
      <Grid container>
        <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
          <TextField
            placeholder="Add item here"
            value={inputValue}
            onChange={changeInput}
            onKeyPress={keyInput}
            fullWidth
          />
        </Grid>
        <Grid xs={2} md={1} item>
          <Button
            fullWidth
            color="secondary"
            variant="outlined"
            onClick={clearInputAndAdd}
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AddItem;
