import React, { Fragment, FunctionComponent } from "react";
import { Router, Redirect } from "@reach/router";

import { SignIn, SignUp } from "./login";
import Dashboard from "./dashboard";

export const Main: FunctionComponent = () => {
  return (
    <Router primary={false} component={Fragment}>
      <Dashboard path="/" />
      <Dashboard path="/:mainId" />
      <Redirect from="/tenth" to="/" noThrow />
      <SignIn path="/sign-in" />
      <SignUp path="/sign-up" />
    </Router>
  );
};

export default Main;
