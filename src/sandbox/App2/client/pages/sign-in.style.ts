import { merge } from "lodash";
import { Theme } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/styles";

export const signInStyles = (
  theme: Theme
): Record<"paper" | "avatar" | "form" | "submit", CSSProperties> => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

export const signUpStyles = (
  theme: Theme
): Record<"paper" | "avatar" | "form" | "submit", CSSProperties> => {
  return merge(signInStyles(theme), { form: { marginTop: theme.spacing(3) } });
};
