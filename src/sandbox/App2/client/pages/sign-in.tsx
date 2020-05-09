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
  PageContainer,
  EmailTextField,
  PasswordTextField,
  Link,
} from "../components";
import { signInStyles } from "./sign-in.style";

const useStyles = makeStyles(signInStyles);

export const SignIn: FunctionComponent<RouteComponentProps> = () => {
  const classes = useStyles();

  return (
    <PageContainer>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <EmailTextField autoFocus margin="normal" />
            <PasswordTextField margin="normal" />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link to="/sign-up" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </PageContainer>
  );
};

export default SignIn;
