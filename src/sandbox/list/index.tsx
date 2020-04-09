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

let currentId = Date.now();
export const tmpId = () => "tmp" + currentId++;

const useItems = (initialItems: readonly Item[] = []) => {
  const [items, setItems] = useState(
    initialItems.map((item) => ({
      id: item.id,
      primary: item.primary,
      selected: !!item.selected
    }))
  );

  return {
    items,
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
    listItemTextProps?: BaseListItemTextProps;
  } & BaseListItemProps
> = ({
  hooks: { primary, selected, remove, update, toggleSelection },
  listItemTextProps,
  ...listItemProps
}) => {
  return (
    <BaseListItem {...listItemProps}>
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

export const List: FunctionComponent<
  {
    items?: Item[];
    listItemProps?: BaseListItemProps;
  } & BaseListProps
> = ({ items: initialItems = [], listItemProps, ...listProps }) => {
  const { items, add, remove, update, toggleSelection } = useItems(
    initialItems
  );
  const { inputValue, changeInput, keyInput, clearInputAndAdd } = useInputValue(
    add
  );

  return (
    <>
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
      <BaseList {...listProps}>
        {items.map((item) => {
          const id = item.id;
          const hooks = {
            ...item,
            remove: () => remove(id),
            update: (value: string) => update(id, value),
            toggleSelection: () => toggleSelection(id)
          };

          return <ListItem key={id} hooks={hooks} {...listItemProps} />;
        })}
      </BaseList>
    </>
  );
};
