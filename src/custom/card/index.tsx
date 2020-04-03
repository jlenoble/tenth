import React, { FunctionComponent, useState } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import { PersistentSortList as List, ListProps } from "../list";

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
    },
    formControl: {
      margin: theme.spacing(3)
    }
  })
);

interface CardProps extends ListProps {}
type UIProps = Required<Pick<CardProps, "ui" | "listItemUI">>;

const ITEM_HEIGHT = 48;

function CheckMenu({
  UI: {
    ui: { addItem },
    listItemUI: { checkbox, deleteButton, editableText }
  },
  setUI
}: {
  UI: UIProps;
  setUI: (UI: UIProps) => void;
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "addItem") {
      setUI({
        ui: { addItem: event.target.checked },
        listItemUI: { checkbox, deleteButton, editableText }
      });
    } else {
      setUI({
        ui: { addItem },
        listItemUI: {
          checkbox,
          deleteButton,
          editableText,
          [event.target.name]: event.target.checked
        }
      });
    }
  };

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
      <Menu
        id="check-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch"
          }
        }}
      >
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">UI elements</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={addItem}
                  onChange={handleChange}
                  name="addItem"
                />
              }
              label="Text input"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={checkbox}
                  onChange={handleChange}
                  name="checkbox"
                />
              }
              label="Checkbox"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={deleteButton}
                  onChange={handleChange}
                  name="deleteButton"
                />
              }
              label="Delete button"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={editableText}
                  onChange={handleChange}
                  name="editableText"
                />
              }
              label="Inline edit"
            />
          </FormGroup>
        </FormControl>
      </Menu>
    </div>
  );
}

export const ListCard: FunctionComponent<CardProps> = ({
  ui,
  listItemUI,
  ...other
}) => {
  const [UI, setUI] = useState({
    ui: ui || { addItem: false },
    listItemUI: listItemUI || {
      checkbox: false,
      deleteButton: false,
      editableText: false
    }
  });
  ui = UI.ui;
  listItemUI = UI.listItemUI;

  return (
    <Card>
      <CardHeader
        action={<CheckMenu UI={UI} setUI={setUI} />}
        title="TODO List"
      />
      <CardContent>
        <List ui={ui} listItemUI={listItemUI} {...other} />
      </CardContent>
    </Card>
  );
};
