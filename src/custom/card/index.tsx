import React, { FunctionComponent } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Popper from "@material-ui/core/Popper";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { PersistentSortList as List, ListProps } from "../list";
import { StatelessListUIProps, useListUI } from "../../core/stateful/ListUI";
import ListUIFormControl from "../../core/stateless/ListUIFormControl";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      border: "1px solid " + theme.palette.divider,
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.paper
    }
  })
);

function CheckMenu(props: StatelessListUIProps) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
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
      <Popper
        id="list-ui"
        anchorEl={anchorEl}
        open={open}
        className={classes.paper}
      >
        <ListUIFormControl {...props} />
      </Popper>
    </div>
  );
}

export const ListCard: FunctionComponent<ListProps> = ({
  ui,
  listItemUI,
  ...other
}) => {
  const props = useListUI({
    add: ui?.addItem,
    check: listItemUI?.checkbox,
    delete: listItemUI?.deleteButton,
    edit: listItemUI?.editableText
  });

  ui = { addItem: props.add.state };
  listItemUI = {
    checkbox: props.check.state,
    deleteButton: props.delete.state,
    editableText: props.edit.state
  };

  return (
    <Card>
      <CardHeader action={<CheckMenu {...props} />} title="TODO List" />
      <CardContent>
        <List ui={ui} listItemUI={listItemUI} {...other} />
      </CardContent>
    </Card>
  );
};
