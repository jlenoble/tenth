import { Theme } from "@material-ui/core/styles";
import { CSSProperties } from "@material-ui/styles";

const drawerWidth = 240;

const toolbarIconStyles = (
  theme: Theme
): Record<"toolbarIcon", CSSProperties> => ({
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
});

export const appBarStyles = (
  theme: Theme
): Record<
  | "toolbar"
  | "toolbarIcon"
  | "appBar"
  | "appBarShift"
  | "menuButton"
  | "menuButtonHidden"
  | "title",
  CSSProperties
> => {
  const { toolbarIcon } = toolbarIconStyles(theme);

  return {
    toolbar: {
      paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon,
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    menuButtonHidden: {
      display: "none",
    },
    title: {
      flexGrow: 1,
    },
  };
};

export const drawerStyles = (
  theme: Theme
): Record<
  "toolbarIcon" | "activeDrawerItem" | "drawerPaper" | "drawerPaperClose",
  CSSProperties
> => {
  const { toolbarIcon } = toolbarIconStyles(theme);

  return {
    toolbarIcon,
    activeDrawerItem: {
      backgroundColor: theme.palette.secondary.light,
      "&:hover": {
        backgroundColor: theme.palette.secondary.light,
      },
    },
    drawerPaper: {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerPaperClose: {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    },
  };
};

export const mainStyles = (
  theme: Theme
): Record<
  "appBarSpacer" | "content" | "container" | "paper" | "fixedHeight",
  CSSProperties
> => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
});
