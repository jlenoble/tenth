import React from "react";
import pick from "lodash/pick";
import Category from "./Category";
import data from "./data";

function App() {
  return (
    <>
      {Object.entries(data.sets).map(([key, itemIds]) => {
        return (
          <Category
            key={key}
            categoryName={key}
            categoryElements={pick(data.items, itemIds)}
          />
        );
      })}
    </>
  );
}

export default App;
