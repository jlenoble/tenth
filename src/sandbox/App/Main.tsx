import React, { FunctionComponent } from "react";
import { Card, CardHeader, CardContent, IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";

export const Main: FunctionComponent = () => {
  return (
    <Card>
      <CardHeader
        action={
          <IconButton aria-label="close" onClick={() => console.log("click")}>
            <Close />
          </IconButton>
        }
      ></CardHeader>
      <CardContent>foo</CardContent>
    </Card>
  );
};

export default Main;
