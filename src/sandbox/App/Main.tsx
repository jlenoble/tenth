import React, { FunctionComponent } from "react";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import { CloseButton } from "../../core";

type Titles = readonly string[];

const CardManager: FunctionComponent<{ texts: Titles }> = ({ texts }) => {
  return (
    <>
      {texts.map((text, i) => (
        <Card key={i}>
          <CardHeader
            action={
              <CloseButton onClick={() => console.log("click " + text)} />
            }
          ></CardHeader>
          <CardContent>{text}</CardContent>
        </Card>
      ))}
    </>
  );
};

export const Main: FunctionComponent = () => {
  return <CardManager texts={["foo", "bar", "baz"]} />;
};

export default Main;
