import { Tooltip } from "@material-ui/core";
import { withStyles, Theme } from "@material-ui/core/styles";

const maxWidth = 220;

export const ErrorTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: theme.palette.error.dark,
    color: "white",
    maxWidth,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid " + theme.palette.error.light
  }
}))(Tooltip);

export default Tooltip;
