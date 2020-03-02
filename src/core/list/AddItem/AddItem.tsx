import React, { FunctionComponent, ChangeEvent, KeyboardEvent } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";

export interface Props {
  inputValue: string;
  onInputChange(event: ChangeEvent<HTMLInputElement>): void;
  onInputKeyPress(event: KeyboardEvent<HTMLInputElement>): void;
  onButtonClick(): void;
}

export const AddItem: FunctionComponent<Props> = ({
  inputValue,
  onInputChange,
  onInputKeyPress,
  onButtonClick
}) => (
  <Paper style={{ margin: 16, padding: 16 }}>
    <Grid container>
      <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
        <TextField
          placeholder="Add item here"
          value={inputValue}
          onChange={onInputChange}
          onKeyPress={onInputKeyPress}
          fullWidth
        />
      </Grid>
      <Grid xs={2} md={1} item>
        <Button
          fullWidth
          color="secondary"
          variant="outlined"
          onClick={onButtonClick}
        >
          Add
        </Button>
      </Grid>
    </Grid>
  </Paper>
);
