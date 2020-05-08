import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#5ac545",
      main: "#1a930f",
      dark: "#006400",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ffea67",
      main: "#f1b834",
      dark: "#ba8800",
      contrastText: "#000",
    },
  },
});

export default theme;
