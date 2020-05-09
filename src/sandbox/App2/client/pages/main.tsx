import React, { Fragment, FunctionComponent } from "react";
import { Router } from "@reach/router";

import { PageContainer } from "../components";
import { SignIn } from "./sign-in";
import { SignUp } from "./sign-up";

export const Main: FunctionComponent = () => {
  return (
    <PageContainer>
      <Router primary={false} component={Fragment}>
        <SignIn path="/sign-in" />
        <SignUp path="/sign-up" />
      </Router>
    </PageContainer>
  );
};

export default Main;
