import React, { FunctionComponent } from "react";
import { Card, CardContent, CardProps } from "@material-ui/core";
import { CardHeader, CardHeaderProps, BaseCardHeaderProps } from "./CardHeader";
import { List, ListProps, BaseListProps } from "./List";

export interface ListCardProps extends CardHeaderProps, ListProps {
  cardHeaderProps?: BaseCardHeaderProps;
  listProps?: BaseListProps;
}

export type BaseListCardProps = CardProps;
export type FullListCardProps = ListCardProps & CardProps;

export const ListCard: FunctionComponent<FullListCardProps> = ({
  droppableId,

  title,
  titleVariant,
  titleLabel,
  titleHelperText,
  titleError,
  titleEnter,
  titleTextFieldProps,
  cardHeaderProps,

  addItemProps,
  listItems,
  checkboxProps,
  listItemTextProps,
  deleteButtonProps,
  listProps,

  ...other
}) => {
  return (
    <Card {...other}>
      <CardHeader
        title={title}
        titleVariant={titleVariant}
        titleLabel={titleLabel}
        titleHelperText={titleHelperText}
        titleError={titleError}
        titleEnter={titleEnter}
        titleTextFieldProps={titleTextFieldProps}
        {...cardHeaderProps}
      />
      <CardContent>
        <List
          droppableId={droppableId}
          addItemProps={addItemProps}
          listItems={listItems}
          checkboxProps={checkboxProps}
          listItemTextProps={listItemTextProps}
          deleteButtonProps={deleteButtonProps}
          {...listProps}
        />
      </CardContent>
    </Card>
  );
};

export default ListCard;
