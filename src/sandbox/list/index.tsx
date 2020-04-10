import React, { FunctionComponent, useState } from "react";

import {
  Paper,
  Grid,
  TextField,
  Button,
  Checkbox,
  IconButton
} from "@material-ui/core";
import { DeleteOutlined } from "@material-ui/icons";

import { DragDropContext, DropResult } from "react-beautiful-dnd";

import {
  List as BaseList,
  ListProps as BaseListProps,
  ListItem as BaseListItem,
  ListItemProps as BaseListItemProps,
  ListItemText as BaseListItemText,
  ListItemTextProps as BaseListItemTextProps
} from "../../core/base";

import { useInputValue, useEditValue } from "../../core/states";

interface Item {
  id: string;
  primary: string;
  selected?: boolean;
}

type StatelessListProps = {
  hooks: ReturnType<typeof useItems>;
  droppableId?: string;
  listItemProps?: BaseListItemProps;
} & BaseListProps;

type StatefulListProps = {
  defaultItems?: Item[];
  onSetItems?: (items: Item[]) => void;
  droppableId?: string;
  listItemProps?: BaseListItemProps;
} & BaseListProps;

let currentId = Date.now();
export const tmpId = () => "tmp" + currentId++;

const useItems = (
  initialItems: Item[] = [],
  onSetItems?: (items: Item[]) => void
) => {
  const [items, setItems] = useState(
    initialItems.map((item) => ({
      id: item.id,
      primary: item.primary,
      selected: Boolean(item.selected)
    }))
  );

  return {
    items,
    setItems: onSetItems
      ? (items: Required<Item>[]) => {
          setItems(items);
          onSetItems(items);
        }
      : setItems,
    add: (value: string) => {
      setItems(items.concat({ id: tmpId(), primary: value, selected: false }));
    },
    remove: (id: string) => {
      setItems(items.filter((item) => item.id !== id));
    },
    update: (id: string, value: string) => {
      setItems(
        items.map((item) =>
          item.id !== id ? item : { ...item, primary: value }
        )
      );
    },
    toggleSelection: (id: string) => {
      setItems(
        items.map((item) =>
          item.id !== id ? item : { ...item, selected: !item.selected }
        )
      );
    }
  };
};

export const withItems = (List: typeof StatelessList) => {
  const WrappedList: FunctionComponent<StatefulListProps> = ({
    defaultItems,
    onSetItems,
    ...other
  }) => {
    return <List {...other} hooks={useItems(defaultItems, onSetItems)} />;
  };

  WrappedList.displayName = `WithItems(${
    List.displayName || List.name || "List"
  })`;

  return WrappedList;
};

export const onDragEnd = ({
  items = [],
  setItems
}: {
  items: Required<Item>[];
  setItems: (items: Required<Item>[]) => void;
}) =>
  setItems
    ? ({ source, destination }: DropResult) => {
        if (!destination) {
          return;
        }

        if (destination.droppableId === source.droppableId) {
          if (destination.index === source.index) {
            return;
          }

          const newItems = items.concat();
          newItems.splice(source.index, 1);
          newItems.splice(destination.index, 0, items[source.index]);

          setItems(newItems);
        }
      }
    : () => {};

export const withDnD = (List: typeof StatelessList): typeof StatelessList => {
  const WrappedList: typeof StatelessList = ({
    hooks,
    droppableId,
    ...other
  }) => (
    <DragDropContext onDragEnd={onDragEnd(hooks)}>
      <List hooks={hooks} droppableId={droppableId || "drop-area"} {...other} />
    </DragDropContext>
  );

  WrappedList.displayName = `WithDnD(${
    List.displayName || List.name || "List"
  })`;

  return WrappedList;
};

const TextInput: FunctionComponent<{
  hooks: { add: (value: string) => void };
}> = ({ hooks: { add } }) => {
  const { inputValue, changeInput, keyInput, clearInputAndAdd } = useInputValue(
    add
  );

  return (
    <Paper style={{ margin: 16, padding: 16 }}>
      <Grid container>
        <Grid xs={10} md={11} item style={{ paddingRight: 16 }}>
          <TextField
            placeholder="Add item here"
            value={inputValue}
            onChange={changeInput}
            onKeyPress={keyInput}
            fullWidth
          />
        </Grid>
        <Grid xs={2} md={1} item>
          <Button
            fullWidth
            color="secondary"
            variant="outlined"
            onClick={clearInputAndAdd}
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

const ListItemText: FunctionComponent<
  { hooks: { update: (value: string) => void } } & BaseListItemTextProps
> = ({ primary, hooks: { update }, ...listItemTextProps }) => {
  const {
    inputValue,
    edited,
    changeInput,
    keyInput,
    edit,
    stopEditing
  } = useEditValue(primary, update);

  const props = edited
    ? {
        primaryTextFieldProps: {
          autoFocus: true,
          fullWidth: true,
          onChange: changeInput,
          onBlur: stopEditing,
          onKeyPress: keyInput
        }
      }
    : { onClick: edit };

  return (
    <BaseListItemText primary={inputValue} {...props} {...listItemTextProps} />
  );
};

const ListItem: FunctionComponent<
  {
    hooks: Item & {
      remove: () => void;
      update: (value: string) => void;
      toggleSelection: () => void;
    };
    dnd?: boolean;
    index: number;
    listItemTextProps?: BaseListItemTextProps;
  } & BaseListItemProps
> = ({
  hooks: { id, primary, selected, remove, update, toggleSelection },
  dnd,
  index,
  listItemTextProps,
  ...listItemProps
}) => {
  return (
    <BaseListItem
      draggableProps={dnd && { draggableId: id, index }}
      {...listItemProps}
    >
      <Checkbox onClick={toggleSelection} checked={selected} />
      <ListItemText
        primary={primary}
        hooks={{ update }}
        {...listItemTextProps}
      />
      <IconButton aria-label="Delete item" onClick={remove}>
        <DeleteOutlined />
      </IconButton>
    </BaseListItem>
  );
};

export const StatelessList: FunctionComponent<StatelessListProps> = ({
  hooks: { items, add, remove, update, toggleSelection },
  droppableId,
  listItemProps,
  ...listProps
}) => {
  const lastIndex = items.length - 1;
  const dnd = Boolean(droppableId);
  const droppableProps = (dnd && { droppableId }) as
    | false
    | { droppableId: string };

  return (
    <>
      <TextInput hooks={{ add }} />
      <BaseList droppableProps={droppableProps} {...listProps}>
        {items.map((item, index) => {
          const id = item.id;
          const hooks = {
            ...item,
            remove: () => remove(id),
            update: (value: string) => update(id, value),
            toggleSelection: () => toggleSelection(id)
          };

          return (
            <ListItem
              key={id}
              divider={index !== lastIndex}
              index={index}
              dnd={dnd}
              hooks={hooks}
              {...listItemProps}
            />
          );
        })}
      </BaseList>
    </>
  );
};

export const StatelessDnDList = withDnD(StatelessList);
export const StatefulList = withItems(StatelessList);
export const StatefulDnDList = withItems(StatelessDnDList);
