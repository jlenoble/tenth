import React from "react";
import List from "./List";
import ListItem from "./ListItem";
import ListItemText from "./ListItemText";

function App() {
  return (
    <List>
      <ListItem>
        <ListItemText primary="Hello1" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Hello2" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Hello3" />
      </ListItem>
      <ListItem>
        <ListItemText primary="Hello4" />
      </ListItem>
    </List>
  );
}

export default App;
