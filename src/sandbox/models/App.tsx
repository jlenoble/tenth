import React from "react";
import { createStore, applyMiddleware } from "redux";
import {
  Card,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
  Grid
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Provider, useSelector } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";
import clsx from "clsx";
import { TodoList, combinedReducer } from "./TodoList";
import { enableLocalStorage, watchVisibilityFilter } from "./todo";
import { CurrentTodo } from "./CurrentTodo";
import { UI } from "./ui";
import { watchAll } from "./sagas";
import "./ListItem.css";

const localStorageId = "todos";

const logger = createLogger({ collapsed: true });
const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  combinedReducer,
  applyMiddleware(logger, sagaMiddleware)
);

sagaMiddleware.run(watchVisibilityFilter);
sagaMiddleware.run(watchAll);
sagaMiddleware.run(enableLocalStorage, localStorageId);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      borderRadius: 0,
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      boxShadow: "none"
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      color: theme.palette.primary.contrastText,
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: "rotate(180deg)"
    }
  })
);

const defaultTitle = "TODOS";

const Layout = () => {
  const classes = useStyles();
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
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
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
                <TodoList viewId={subViewId} />
              </CardContent>
            </Grid>
          )}
        </Grid>
      </Collapse>
    </Card>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Layout />
    </Provider>
  );
}

export default App;
