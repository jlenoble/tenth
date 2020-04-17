import React, { FunctionComponent } from "react";
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

export default AddItem;
