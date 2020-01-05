import React, { FunctionComponent } from "react";
import List from "./DroppableList";
import ListItem from "./DraggableListItem";
import ListItemText from "./ListItemText";

type CategoryProps = {
  categoryName: string;
  categoryElements: { [key: string]: string };
};

const Category: FunctionComponent<CategoryProps> = ({
  categoryName,
  categoryElements
}) => {
  return (
    <div>
      <h3>{categoryName}</h3>
      <List droppableId={categoryName}>
        {Object.entries(categoryElements).map(([key, value], index) => {
          return (
            <ListItem key={key} draggableId={key} index={index}>
              <ListItemText primary={value} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default Category;
