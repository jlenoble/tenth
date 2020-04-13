import React, { FunctionComponent } from "react";
import { Paper, ListItemText } from "@material-ui/core";
import List from "../../mui-base/List";
import ListItem from "../../mui-base/ListItem";

type CategoryProps = {
  className?: string;
  categoryName: string;
  categoryElements: { [key: string]: string };
  dnd?: boolean;
};

const Category: FunctionComponent<CategoryProps> = ({
  className,
  categoryName,
  categoryElements,
  dnd
}) => {
  const pairs = Object.entries(categoryElements);

  return (
    <div>
      <h3>{categoryName}</h3>
      <Paper>
        <List
          className={className}
          droppableProps={dnd && { droppableId: categoryName }}
        >
          {pairs.map(([key, value], index) => {
            return (
              <ListItem
                className={className}
                key={key}
                divider={index !== pairs.length - 1}
                draggableProps={dnd && { draggableId: key, index }}
              >
                <ListItemText primary={value} />
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </div>
  );
};

export default Category;
