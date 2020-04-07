import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl, { FormControlProps } from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { StatelessListUI, withListUI } from "../../stateful/ListUI";
import Checkbox from "../Checkbox";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    formControl: {
      margin: theme.spacing(1)
    }
  })
);

export const StatelessListUIFormControl: StatelessListUI<FormControlProps<
  "fieldset"
>> = ({ add, check, delete: deleteProps, edit, ...other }) => {
  const classes = useStyles();

  return (
    <FormControl
      component="fieldset"
      className={classes.formControl}
      {...other}
    >
      <FormLabel component="legend">List UI elements</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox {...add} name="add" />}
          label="Text input"
        />
        <FormControlLabel
          control={<Checkbox {...check} name="check" />}
          label="Checkbox"
        />
        <FormControlLabel
          control={<Checkbox {...deleteProps} name="delete" />}
          label="Delete button"
        />
        <FormControlLabel
          control={<Checkbox {...edit} name="edit" />}
          label="Inline edit"
        />
      </FormGroup>
    </FormControl>
  );
};

export const StatefulListUIFormControl = withListUI(StatelessListUIFormControl);

export default StatelessListUIFormControl;
