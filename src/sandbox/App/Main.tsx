import React, { FunctionComponent } from "react";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import { CloseButton } from "../../core";

export const Main: FunctionComponent = () => {
  return (
    <Card>
      <CardHeader
        action={<CloseButton onClick={() => console.log("click")} />}
      ></CardHeader>
      <CardContent>foo</CardContent>
    </Card>
  );
};

export default Main;
