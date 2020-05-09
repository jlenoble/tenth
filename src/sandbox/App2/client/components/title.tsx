import React, { FunctionComponent } from "react";
import { Typography, TypographyProps } from "@material-ui/core";

export const Title: FunctionComponent<TypographyProps> = ({ children }) => {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      {children}
    </Typography>
  );
};

export default Title;
