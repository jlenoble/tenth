import React, { FunctionComponent } from "react";

import {
  Card,
  CardProps,
  Checkbox,
  CardHeader,
  CardContent,
  IconButton,
  Popover,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Theme
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { MoreVert } from "@material-ui/icons";

import { DragDropContext } from "react-beautiful-dnd";

import { Item, useItems, useToggle, ListProps, List, onDragEnd } from "../list";

type ListCardProps = {
  title: string;
  hooks: ReturnType<typeof useItems>;
  droppableId?: string;
  listProps?: Omit<ListProps, "hooks" | "droppableId">;
} & CardProps;

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

function CheckMenu({ hooks }: { hooks: ReturnType<typeof useItems> }) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { items, checkAll, uncheckAll } = hooks;
  const allChecked = items.every((item) => item.checked);

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
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Global actions</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={allChecked}
                  onClick={allChecked ? uncheckAll : checkAll}
                  name="checkAll"
                />
              }
              label="Check all"
            />
          </FormGroup>
        </FormControl>
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
  return (
    <Card {...other}>
      <CardHeader action={<CheckMenu hooks={hooks} />} title={title} />
      <CardContent>
        <List hooks={hooks} droppableId={droppableId} {...listProps} />
      </CardContent>
    </Card>
  );
};
