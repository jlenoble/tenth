import React, { FunctionComponent } from "react";
import List from "./List";
import ListItem from "./ListItem";
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
      <List>
        {Object.entries(categoryElements).map(([key, value]) => {
          return (
            <ListItem key={key}>
              <ListItemText primary={value} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default Category;
