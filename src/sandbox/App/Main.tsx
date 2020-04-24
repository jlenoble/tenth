import React, { FunctionComponent } from "react";
import { combineReducers } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import { AddButton, CloseButton } from "../../core";
import { newViewManagerId as newId } from "./ids";

const CLOSE_CARD = "CLOSE_CARD";
const CREATE_CARD = "CREATE_CARD";

type CloseCardAction = {
  type: typeof CLOSE_CARD;
  cardManagerId: string;
  cardId: string;
};

type CreateCardAction = {
  type: typeof CREATE_CARD;
  cardManagerId: string;
  title?: string;
};

type CardAction = CloseCardAction | CreateCardAction;

const closeCard = ({
  cardManagerId,
  cardId
}: {
  cardManagerId: string;
  cardId: string;
}): CardAction => {
  return {
    type: CLOSE_CARD,
    cardManagerId,
    cardId
  };
};

const createCard = ({
  cardManagerId,
  title
}: {
  cardManagerId: string;
  title?: string;
}): CardAction => {
  return {
    type: CREATE_CARD,
    cardManagerId,
    title
  };
};

type Card = Readonly<{ cardId: string }>;
type CardMap = Readonly<{
  [cardId: string]: Omit<Card, "cardId">;
}>;

const makeCardReducer = (cardManagerId: string) => {
  const cardsInitialState: CardMap = {};

  const cards = (state = cardsInitialState, action: CardAction) => {
    if (action.cardManagerId !== cardManagerId) {
      return state;
    }

    switch (action.type) {
      case CLOSE_CARD: {
        const newState = { ...state };
        delete newState[action.cardId];
        return newState;
      }

      case CREATE_CARD: {
        return { ...state, [newId()]: { title: action.title } };
      }

      default:
        return state;
    }
  };

  return cards;
};

export const combinedReducer = combineReducers({
  m1: makeCardReducer("m1"),
  m2: makeCardReducer("m2")
});

type CardManagerIds = "m1" | "m2";

const CardManager: FunctionComponent<{
  cardManagerId: CardManagerIds;
  createAction: JSX.Element;
}> = ({ cardManagerId, createAction }) => {
  const dispatch = useDispatch();
  const cards = useSelector(
    (state: ReturnType<typeof combinedReducer>) => state[cardManagerId]
  );
  const cardIds = Object.keys(cards);

  return (
    <>
      {createAction}
      {cardIds.map((cardId) => (
        <Card key={cardId}>
          <CardHeader
            action={
              <CloseButton
                onClick={() => dispatch(closeCard({ cardManagerId, cardId }))}
              />
            }
          ></CardHeader>
          <CardContent></CardContent>
        </Card>
      ))}
    </>
  );
};

export const Main: FunctionComponent = () => {
  const dispatch = useDispatch();

  return (
    <>
      <CardManager
        cardManagerId={"m1"}
        createAction={
          <AddButton
            onClick={() => dispatch(createCard({ cardManagerId: "m1" }))}
          />
        }
      />
      <CardManager
        cardManagerId={"m2"}
        createAction={
          <AddButton
            onClick={() => dispatch(createCard({ cardManagerId: "m2" }))}
          />
        }
      />
    </>
  );
};

export default Main;
