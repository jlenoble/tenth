import React, { FunctionComponent } from "react";
import "./List.css";

const List: FunctionComponent = ({ children }) => {
  return <ul>{children}</ul>;
};

export default List;
