import React, { FunctionComponent } from "react";

type ListItemTextProps = {
  primary: string;
};

const ListItemText: FunctionComponent<ListItemTextProps> = ({ primary }) => {
  return <>{primary}</>;
};

export default ListItemText;
