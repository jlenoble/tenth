import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import {
  Paper,
  Grid,
  TextField,
  TextFieldProps,
  Button,
  ButtonProps,
} from "@material-ui/core";
import { CatchError } from "./ErrorFeedback";

export type AddItemProps = TextFieldProps & {
  buttonProps?: ButtonProps;
};

export const AddItem: FunctionComponent<AddItemProps> = ({
  buttonProps,
  ...other
}) => {
  const textField = (
    <TextField placeholder="Add item here" fullWidth {...other} />
  );

  return (
    <Paper elevation={0} style={{ marginBottom: 16, padding: 16 }}>
      {buttonProps ? (
        <Grid container>
          <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
            {textField}
          </Grid>
          <Grid xs={2} md={1} item>
            <Button
              fullWidth
              color="secondary"
              variant="outlined"
              {...buttonProps}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      ) : (
        textField
      )}
    </Paper>
  );
};

export const useAddItem = (
  add: (value: string) => void
): {
  value: string;
  changeInput: (event: ChangeEvent<HTMLInputElement>) => void;
  clearInputAndAdd: () => void;
  keyInput: (event: KeyboardEvent<HTMLInputElement>) => boolean;
} => {
  const [value, setValue] = useState("");

  const changeInput = (event: ChangeEvent<HTMLInputElement>): void =>
    setValue(event.target.value);

  const clearInputAndAdd = (): void => {
    setValue("");
    add(value);
  };

  const keyInput = (event: KeyboardEvent<HTMLInputElement>): boolean => {
    if (event.key === "Enter") {
      clearInputAndAdd();
      return true;
    }

    return false;
  };

  return {
    value,
    changeInput,
    clearInputAndAdd,
    keyInput,
  };
};

export interface StatefulAddItemProps {
  add: (value: string) => void;
  button?: boolean;
  catchError?: CatchError;
}

export const StatefulAddItem: FunctionComponent<StatefulAddItemProps> = ({
  add,
  button = true,
  catchError,
}) => {
  const { value, changeInput, clearInputAndAdd, keyInput } = useAddItem(
    catchError ? catchError(add) : add
  );

  return (
    <AddItem
      value={value}
      onChange={changeInput}
      onKeyPress={keyInput}
      buttonProps={button ? { onClick: clearInputAndAdd } : undefined}
    />
  );
};

export default AddItem;
