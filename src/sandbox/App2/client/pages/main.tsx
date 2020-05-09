import React, { Fragment, FunctionComponent } from "react";
import { Router, Redirect } from "@reach/router";

import { PageContainer } from "../components";
import { SignIn } from "./sign-in";
import { SignUp } from "./sign-up";
import Dashboard from "./dashboard";

export const Main: FunctionComponent = () => {
  return (
    <PageContainer>
      <Router primary={false} component={Fragment}>
        <Dashboard path="/" />
        <Redirect from="/tenth" to="/" noThrow />
        <SignIn path="/sign-in" />
        <SignUp path="/sign-up" />
      </Router>
    </PageContainer>
  );
};

export default Main;
