import { call, fork, put, takeLatest } from "redux-saga/effects";
import { getCategories } from "../../api/api";
import { setSagaCategories } from "../features/sagaSlice";

function* fetchCategories() {
  try {
    const user = yield call(getCategories);
    yield put(setSagaCategories(user.data));
  } catch (e) {
    yield put({ type: "USER_FETCH_FAILED", message: e.message });
  }
}
export default function* categoriesWatcher() {
  yield takeLatest(setSagaCategories.type, fetchCategories);
}
