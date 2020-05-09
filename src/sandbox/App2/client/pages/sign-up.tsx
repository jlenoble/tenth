import React, { FunctionComponent } from "react";
import { RouteComponentProps } from "@reach/router";

import {
  Avatar,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";

import {
  FirstNameTextField,
  LastNameTextField,
  EmailTextField,
  PasswordTextField,
  Link,
} from "../components";
import { signUpStyles } from "./sign-in.style";

const useStyles = makeStyles(signUpStyles);

export const SignUp: FunctionComponent<RouteComponentProps> = () => {
  const classes = useStyles();

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FirstNameTextField autoFocus />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LastNameTextField />
            </Grid>
            <Grid item xs={12}>
              <EmailTextField />
            </Grid>
            <Grid item xs={12}>
              <PasswordTextField />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/sign-in" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default SignUp;
