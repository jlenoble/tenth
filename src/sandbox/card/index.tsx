import React, { FunctionComponent } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Popover from "@material-ui/core/Popover";
import { PersistentSortList as List, ListProps } from "../../custom/list";
import { StatelessListUIProps, useListUI } from "../../core/stateful/ListUI";
import ListUIFormControl from "../../core/stateless/ListUIFormControl";

function CheckMenu(props: StatelessListUIProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        <ListUIFormControl {...props} />
      </Popover>
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
