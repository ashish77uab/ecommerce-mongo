import { all } from "redux-saga/effects";
import { categoriesSaga } from "./sagas/categoriesSaga";

export default function* MySagas() {
  yield all([...categoriesSaga]);
}
