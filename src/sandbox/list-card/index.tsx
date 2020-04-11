import React, { FunctionComponent, useState } from "react";

import {
  Card,
  CardProps,
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

import { CardHeader } from "../../core/base";

import {
  Item,
  useItems,
  ListProps,
  List,
  ListUI,
  onDragEnd,
  useEditValue
} from "../list";

export interface Collection {
  id: string;
  title: string;
  items: Item[];
}

export type ListCardProps = {
  hooks: ReturnType<typeof useCollection>;
  ui?: ListUI;
  droppableId?: string;
  listProps?: Omit<ListProps, "hooks" | "droppableId">;
} & Omit<CardProps, "title">;

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

export const useCollection = (
  initialCollection: Collection,
  onSetCollection?: (collection: Collection) => void
) => {
  const id = initialCollection.id;
  const [title, setTitle] = useState(initialCollection.title);
  const hooks = useItems(
    initialCollection.items,
    onSetCollection
      ? (items: Item[]) => {
          onSetCollection({ id, title, items });
        }
      : undefined
  );
  const items = hooks.items;

  const wrappedSetTitle = onSetCollection
    ? (title: string) => {
        onSetCollection({ id, title, items });
      }
    : setTitle;

  return { ...hooks, title, setTitle: wrappedSetTitle };
};

export const withCollection = (ListCard: FunctionComponent<ListCardProps>) => {
  const WrappedListCard: FunctionComponent<
    Omit<ListCardProps, "hooks"> & {
      defaultCollection: Collection;
      onSetCollection?: (collection: Collection) => void;
    }
  > = ({ defaultCollection, onSetCollection, ...other }) => {
    return (
      <ListCard
        {...other}
        hooks={useCollection(defaultCollection, onSetCollection)}
      />
    );
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
      defaultCollection: Collection;
      onSetCollection?: (collection: Collection) => void;
    }
  >
) => {
  const WrappedListCard: FunctionComponent<
    Omit<ListCardProps, "hooks"> & {
      defaultCollection?: Collection;
      onSetCollection?: (collection: Collection) => void;
      localStorageId: string;
    }
  > = ({ defaultCollection, onSetCollection, localStorageId, ...other }) => {
    if (!defaultCollection) {
      defaultCollection = JSON.parse(
        localStorage.getItem(localStorageId) || "[]"
      ) as Collection;
    }

    const saveCollection = (collection: Collection) => {
      localStorage.setItem(localStorageId, JSON.stringify(collection));
    };

    return (
      <ListCard
        {...other}
        defaultCollection={defaultCollection}
        onSetCollection={
          onSetCollection
            ? (collection: Collection) => {
                onSetCollection(collection);
                saveCollection(collection);
              }
            : saveCollection
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
  hooks,
  ui = {},
  droppableId,
  listProps,
  ...other
}) => {
  const [filter, setFilter] = useState(
    "all" as "all" | "checked" | "unchecked"
  );
  let items = hooks.items;
  const checkedItems = items.filter((item) => item.checked);
  const uncheckedItems = items.filter((item) => !item.checked);

  const nItems = items.length;
  const nChecked = checkedItems.length;
  const nUnchecked = uncheckedItems.length;

  if (filter === "checked") {
    items = checkedItems;
  } else if (filter === "unchecked") {
    items = items.filter((item) => !item.checked);
  } else {
    items = uncheckedItems.concat(checkedItems);
  }

  hooks = { ...hooks, items };

  const {
    inputValue,
    edited,
    changeInput,
    keyInput,
    startEditing,
    stopEditing
  } = useEditValue(hooks.title, hooks.setTitle);

  const cardHeaderProps = edited
    ? {
        titleTextFieldProps: {
          autoFocus: true,
          fullWidth: true,
          onChange: changeInput,
          onBlur: stopEditing,
          onKeyPress: keyInput
        }
      }
    : { onClick: startEditing };

  return (
    <Card {...other}>
      <CardHeader
        action={<CheckMenu hooks={hooks} />}
        {...cardHeaderProps}
        title={inputValue}
      />
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
        <List hooks={hooks} ui={ui} droppableId={droppableId} {...listProps} />
      </CardContent>
    </Card>
  );
};
