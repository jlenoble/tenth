import { makeStyles as muiMakeStyles } from "@material-ui/core/styles";

export const makeStyles = ({
  formMarginTopSpacing,
}: {
  formMarginTopSpacing: number;
}): ((
  props?: any // eslint-disable-line @typescript-eslint/no-explicit-any
) => Record<"paper" | "avatar" | "form" | "submit", string>) => {
  return muiMakeStyles((theme) => ({
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
      marginTop: theme.spacing(formMarginTopSpacing),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));
};

export default makeStyles;
