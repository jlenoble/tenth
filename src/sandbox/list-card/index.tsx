import React, { FunctionComponent, useState } from "react";

import {
  Card,
  CardProps,
  CardHeader,
  CardContent,
  CardActions,
  Checkbox,
  Button,
  IconButton,
  Popover,
  MenuList,
  MenuItem,
  Grid
} from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";

import { DragDropContext } from "react-beautiful-dnd";

import { Item, useItems, ListProps, List, onDragEnd } from "../list";

type ListCardProps = {
  title: string;
  hooks: ReturnType<typeof useItems>;
  droppableId?: string;
  listProps?: Omit<ListProps, "hooks" | "droppableId">;
} & CardProps;

function CheckMenu({ hooks }: { hooks: ReturnType<typeof useItems> }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { items, checkAll, uncheckAll, clear } = hooks;

  const disabled = !items.length;
  const allChecked = !disabled && items.every((item) => item.checked);

  return (
    <div>
      <IconButton
        aria-label="setting"
        aria-controls="check-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Popover
        id="check-menu"
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
        <MenuList>
          <MenuItem
            disabled={disabled}
            onClick={() => {
              if (allChecked) uncheckAll();
              else checkAll();
            }}
          >
            Check all
            <Checkbox disabled={disabled} checked={allChecked} />
          </MenuItem>
          <MenuItem
            disabled={disabled}
            onClick={() => {
              clear();
              handleClose();
            }}
          >
            Clear list
          </MenuItem>
        </MenuList>
      </Popover>
    </div>
  );
}

export const withItems = (ListCard: FunctionComponent<ListCardProps>) => {
  const WrappedListCard: FunctionComponent<
    Omit<ListCardProps, "hooks"> & {
      defaultItems?: Item[];
      onSetItems?: (items: Item[]) => void;
    }
  > = ({ defaultItems, onSetItems, ...other }) => {
    return <ListCard {...other} hooks={useItems(defaultItems, onSetItems)} />;
  };

  WrappedListCard.displayName = `WithItems(${
    ListCard.displayName || ListCard.name || "ListCard"
  })`;

  return WrappedListCard;
};

export const withDnD = (ListCard: FunctionComponent<ListCardProps>) => {
  const WrappedListCard: FunctionComponent<ListCardProps> = ({
    hooks,
    droppableId,
    ...other
  }) => (
    <DragDropContext onDragEnd={onDragEnd(hooks)}>
      <ListCard
        hooks={hooks}
        droppableId={droppableId || "drop-area"}
        {...other}
      />
    </DragDropContext>
  );

  WrappedListCard.displayName = `WithDnD(${
    ListCard.displayName || ListCard.name || "ListCard"
  })`;

  return WrappedListCard;
};

export const withLocalStorage = (
  ListCard: FunctionComponent<
    Omit<ListCardProps, "hooks"> & {
      defaultItems?: Item[];
      onSetItems?: (items: Item[]) => void;
    }
  >
) => {
  const WrappedListCard: FunctionComponent<
    Omit<ListCardProps, "hooks"> & {
      defaultItems?: Item[];
      onSetItems?: (items: Item[]) => void;
      localStorageId: string;
    }
  > = ({ defaultItems, onSetItems, localStorageId, ...other }) => {
    if (!defaultItems) {
      defaultItems = JSON.parse(
        localStorage.getItem(localStorageId) || "[]"
      ) as Item[];
    }

    const saveItems = (items: Item[]) => {
      localStorage.setItem(localStorageId, JSON.stringify(items));
    };

    return (
      <ListCard
        {...other}
        defaultItems={defaultItems}
        onSetItems={
          onSetItems
            ? (items: Item[]) => {
                onSetItems(items);
                saveItems(items);
              }
            : saveItems
        }
      />
    );
  };

  WrappedListCard.displayName = `WithLocalStorage(${
    List.displayName || List.name || "List"
  })`;

  return WrappedListCard;
};

export const ListCard: FunctionComponent<ListCardProps> = ({
  title,
  hooks,
  droppableId,
  listProps,
  ...other
}) => {
  const [filter, setFilter] = useState(
    "all" as "all" | "checked" | "unchecked"
  );
  let items = hooks.items;
  const checkedItems = items.filter((item) => item.checked);

  const nItems = items.length;
  const nChecked = checkedItems.length;
  const nUnchecked = nItems - nChecked;

  if (filter === "checked") {
    items = checkedItems;
  } else if (filter === "unchecked") {
    items = items.filter((item) => !item.checked);
  }

  hooks = { ...hooks, items };

  return (
    <Card {...other}>
      <CardHeader action={<CheckMenu hooks={hooks} />} title={title} />
      <CardActions>
        <Grid container>
          <Grid item xs={4} sm={3} md={2}>
            <Button
              variant={filter === "all" ? "contained" : "outlined"}
              fullWidth
              disableRipple
              size="small"
              color="primary"
              onClick={() => setFilter("all")}
            >
              All ({nItems})
            </Button>
          </Grid>
          <Grid item xs={4} sm={3} md={2}>
            <Button
              variant={filter === "checked" ? "contained" : "outlined"}
              fullWidth
              disableRipple
              size="small"
              color="primary"
              onClick={() => setFilter("checked")}
            >
              Checked ({nChecked})
            </Button>
          </Grid>
          <Grid item xs={4} sm={3} md={2}>
            <Button
              variant={filter === "unchecked" ? "contained" : "outlined"}
              fullWidth
              disableRipple
              size="small"
              color="primary"
              onClick={() => setFilter("unchecked")}
            >
              Unchecked ({nUnchecked})
            </Button>
          </Grid>
        </Grid>
      </CardActions>
      <CardContent>
        <List hooks={hooks} droppableId={droppableId} {...listProps} />
      </CardContent>
    </Card>
  );
};
