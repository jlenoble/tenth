import React, { FunctionComponent } from "react";
import { Paper, Grid, TextField, Button } from "@material-ui/core";
import { useInputValue } from "./use";

export interface AddItemProps {
  add: (value: string) => void;
}

export const AddItem: FunctionComponent<AddItemProps> = ({ add }) => {
  const { inputValue, changeInput, keyInput, clearInputAndAdd } = useInputValue(
    add
  );

  return (
    <Paper elevation={0} style={{ marginBottom: 16, padding: 16 }}>
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
