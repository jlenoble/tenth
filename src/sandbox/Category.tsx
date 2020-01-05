import React, { FunctionComponent } from "react";
import List from "./List";
import ListItem from "./ListItem";
import ListItemText from "./ListItemText";

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
  if (dnd) {
    return (
      <div>
        <h3>{categoryName}</h3>
        <List
          className={className}
          droppableProps={{ droppableId: categoryName }}
        >
          {Object.entries(categoryElements).map(([key, value], index) => {
            return (
              <ListItem
                className={className}
                key={key}
                draggableProps={{ draggableId: key, index }}
              >
                <ListItemText primary={value} />
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  }

  return (
    <div>
      <h3>{categoryName}</h3>
      <List className={className}>
        {Object.entries(categoryElements).map(([key, value], index) => {
          return (
            <ListItem className={className} key={key}>
              <ListItemText primary={value} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default Category;
