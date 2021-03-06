import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Grid,
} from "@material-ui/core";
import { Close, ExpandMore } from "@material-ui/icons";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import clsx from "clsx";
import { TodoList } from "./TodoList";
import { CurrentTodo } from "./CurrentTodo";
import { UI, closeSubView } from "./ui";
import "./ListItem.css";
import "./IconButton.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      borderRadius: 0,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      boxShadow: "none",
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      color: theme.palette.primary.contrastText,
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
  })
);

export const defaultTitle = "TODOS";

export const Layout = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [expanded, setExpanded] = React.useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { mainViewId: viewId, subViewId }: UI = useSelector(
    (state: { ui: UI }) => state.ui
  );

  return (
    <Card classes={{ root: classes.card }}>
      <CardContent>
        <CurrentTodo viewId={viewId} />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMore />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Grid container>
          <Grid item xs={12} md={subViewId ? 6 : 12}>
            <CardContent>
              <TodoList viewId={viewId} title={defaultTitle} />
            </CardContent>
          </Grid>
          {subViewId && (
            <Grid item xs={12} md={6}>
              <CardContent>
                <TodoList
                  viewId={subViewId}
                  cardHeaderProps={{
                    action: (
                      <IconButton
                        aria-label="Close item"
                        onClick={() => dispatch(closeSubView({ subViewId }))}
                      >
                        <Close />
                      </IconButton>
                    ),
                  }}
                />
              </CardContent>
            </Grid>
          )}
        </Grid>
      </Collapse>
    </Card>
  );
};
