import { take } from "redux-saga/effects";
import { SagaGenerator } from "../../../generics";
import {
  ADD_RELATIONSHIP,
  AddRelationshipAction,
  ADD_RELATIONSHIPS,
  AddRelationshipsAction,
} from "../redux-reducers";

export function* addRelationshipSaga(): SagaGenerator {
  const { ids }: AddRelationshipAction = yield take(ADD_RELATIONSHIP);
  console.log("************ on ADD_RELATIONSHIP");
}

export function* addRelationshipsSaga(): SagaGenerator {
  const { relationships }: AddRelationshipsAction = yield take(
    ADD_RELATIONSHIPS
  );
  console.log("************ on ADD_RELATIONSHIPS");
}
