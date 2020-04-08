import React, { FunctionComponent } from "react";
import Card from "@material-ui/core/Card";
import Checkbox from "@material-ui/core/Checkbox";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Popover from "@material-ui/core/Popover";
import { PersistentSortList as List, ListProps } from "../../custom/list";
import useListUI from "../../core/states/useListUI";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

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

function CheckMenu(props: ReturnType<typeof useListUI>) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { add, check, delete: deleteProps, edit } = props;

  return (
    <div>
      <IconButton
        aria-label="setting"
        aria-controls="check-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Popover
        id="list-ui"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
      >
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">List UI elements</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox checked={add.state} onClick={add.toggle} name="add" />
              }
              label="Text input"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={check.state}
                  onClick={check.toggle}
                  name="check"
                />
              }
              label="Checkbox"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={deleteProps.state}
                  onClick={deleteProps.toggle}
                  name="delete"
                />
              }
              label="Delete button"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={edit.state}
                  onClick={edit.toggle}
                  name="edit"
                />
              }
              label="Inline edit"
            />
          </FormGroup>
        </FormControl>
      </Popover>
    </div>
  );
}

export const ListCard: FunctionComponent<ListProps> = ({ ui, ...other }) => {
  const props = useListUI({
    add: ui?.addItem,
    check: ui?.checkbox,
    delete: ui?.deleteButton,
    edit: ui?.editableText
  });

  ui = {
    addItem: props.add.state,
    checkbox: props.check.state,
    deleteButton: props.delete.state,
    editableText: props.edit.state
  };

  return (
    <Card>
      <CardHeader action={<CheckMenu {...props} />} title="TODO List" />
      <CardContent>
        <List ui={ui} {...other} />
      </CardContent>
    </Card>
  );
};
