import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import { StatelessAddItem } from "../stateful";

export const AddItem: StatelessAddItem = ({
  inputValue,
  changeInput,
  keyInput,
  clearInputAndAdd,
}) => (
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
