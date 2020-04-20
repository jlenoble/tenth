import React from "react";
import { createStore, applyMiddleware } from "redux";
import {
  Card,
  CardContent,
  CardActions,
  Collapse,
  IconButton
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";
import clsx from "clsx";
import { TodoList, combinedReducer } from "./TodoList";
import {
  enableLocalStorage,
  watchInputs,
  watchVisibilityFilter,
  rootId
} from "./todo";
import { CurrentTodo } from "./CurrentTodo";

const localStorageId = "todos";

const logger = createLogger({ collapsed: true });
const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  combinedReducer,
  applyMiddleware(logger, sagaMiddleware)
);

sagaMiddleware.run(watchVisibilityFilter);
sagaMiddleware.run(watchInputs);
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

function App() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(true);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Provider store={store}>
      <Card classes={{ root: classes.card }}>
        <CardContent>
          <CurrentTodo viewId={rootId} />
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
          <CardContent>
            <TodoList viewId={rootId} />
          </CardContent>
        </Collapse>
      </Card>
    </Provider>
  );
}

export default App;
