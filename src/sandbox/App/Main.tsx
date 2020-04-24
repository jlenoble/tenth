import React, { FunctionComponent } from "react";
import { combineReducers } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardContent } from "@material-ui/core";
import { AddButton, CloseButton } from "../../core";

type Titles = readonly string[];

const CLOSE_CARD = "CLOSE_CARD";
const CREATE_CARD = "CREATE_CARD";

type CloseCardAction = {
  type: typeof CLOSE_CARD;
  cardId: string;
};

type CreateCardAction = {
  type: typeof CREATE_CARD;
  title?: string;
};

type CardAction = CloseCardAction | CreateCardAction;

const closeCard = (cardId: string): CardAction => {
  return {
    type: CLOSE_CARD,
    cardId
  };
};

const createCard = ({ title }: { title?: string } = {}): CardAction => {
  return {
    type: CREATE_CARD,
    title
  };
};

type Card = Readonly<{ cardId: string }>;
type CardMap = Readonly<{
  [cardId: string]: Omit<Card, "cardId">;
}>;

const cardsInitialState: CardMap = {};
let cardId = 0;
const newId = () => "card" + ++cardId;

const cards = (state = cardsInitialState, action: CardAction) => {
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

export const combinedReducer = combineReducers({
  cards
});

const CardManager: FunctionComponent<{
  createAction: JSX.Element;
}> = ({ createAction }) => {
  const dispatch = useDispatch();
  const cards = useSelector((state: { cards: CardMap }) => state.cards);
  const cardIds = Object.keys(cards);

  return (
    <>
      {createAction}
      {cardIds.map((cardId) => (
        <Card key={cardId}>
          <CardHeader
            action={<CloseButton onClick={() => dispatch(closeCard(cardId))} />}
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
    <CardManager
      createAction={<AddButton onClick={() => dispatch(createCard())} />}
    />
  );
};

export default Main;
