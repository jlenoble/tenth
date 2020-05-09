import React, { Fragment, FunctionComponent } from "react";
import { Router, Redirect } from "@reach/router";

import { SignIn } from "./sign-in";
import { SignUp } from "./sign-up";
import Dashboard from "./dashboard";

export const Main: FunctionComponent = () => {
  return (
    <Router primary={false} component={Fragment}>
      <Dashboard path="/" />
      <Redirect from="/tenth" to="/" noThrow />
      <SignIn path="/sign-in" />
      <SignUp path="/sign-up" />
    </Router>
  );
};

export default Main;
