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
  ListItemText,
  ListItemTextProps
} from "../../core/base";

import { useInputValue, useEditValue } from "../../core/states";

interface Item {
  primary: string;
  selected: boolean;
}

const useItems = (initialItems: string[] = []) => {
  const [items, setItems] = useState(
    initialItems.map((item) => ({ primary: item, selected: false }))
  );

  return {
    items,
    add: (value: string) => {
      setItems(items.concat({ primary: value, selected: false }));
    },
    remove: (index: number) => {
      setItems(items.filter((_, i) => index !== i));
    },
    update: (index: number, value: string) => {
      setItems(
        items.map((item, i) =>
          i !== index ? item : { ...item, primary: value }
        )
      );
    },
    toggleSelection: (index: number) => {
      setItems(
        items.map((item, i) =>
          i !== index ? item : { ...item, selected: !item.selected }
        )
      );
    }
  };
};

const ListItem: FunctionComponent<
  {
    hooks: Item & {
      remove: () => void;
      update: (value: string) => void;
      toggleSelection: () => void;
    };
    listItemTextProps?: ListItemTextProps;
  } & BaseListItemProps
> = ({
  hooks: { primary, selected, remove, update, toggleSelection },
  listItemTextProps,
  ...listItemProps
}) => {
  const { edited, changeInput, keyInput, edit, stopEditing } = useEditValue(
    primary,
    update
  );

  const editProps = edited
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
    <BaseListItem {...listItemProps}>
      <Checkbox onClick={toggleSelection} checked={selected} />
      <ListItemText primary={primary} {...editProps} {...listItemTextProps} />
      <IconButton aria-label="Delete item" onClick={remove}>
        <DeleteOutlined />
      </IconButton>
    </BaseListItem>
  );
};

export const List: FunctionComponent<
  { items?: string[]; listItemProps?: BaseListItemProps } & BaseListProps
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
        {items.map((item, i) => {
          const hooks = {
            ...item,
            remove: () => remove(i),
            update: (value: string) => update(i, value),
            toggleSelection: () => toggleSelection(i)
          };

          return <ListItem key={i} hooks={hooks} {...listItemProps} />;
        })}
      </BaseList>
    </>
  );
};
