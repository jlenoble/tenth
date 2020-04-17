import React, {
  FunctionComponent,
  useState,
  ChangeEvent,
  KeyboardEvent
} from "react";
import {
  Paper,
  Grid,
  TextField,
  TextFieldProps,
  Button,
  ButtonProps
} from "@material-ui/core";

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

export const useAddItem = (add: (value: string) => void) => {
  const [value, setValue] = useState("");

  const changeInput = (event: ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value);

  const clearInputAndAdd = () => {
    setValue("");
    add(value);
  };

  const keyInput = (event: KeyboardEvent<HTMLInputElement>) => {
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
    keyInput
  };
};

export interface StatefulAddItemProps {
  add: (value: string) => void;
  button?: boolean;
}

export const StatefulAddItem: FunctionComponent<StatefulAddItemProps> = ({
  add,
  button = true
}) => {
  const { value, changeInput, clearInputAndAdd, keyInput } = useAddItem(add);

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
