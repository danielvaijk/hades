import { createStore, combineReducers } from "redux";

import User from "./models/User";
import Robot from "./models/Robot";
import Database from "./Database";

const initialState = {
    apples: 10,
};

function regularReducer(state = initialState, action) {
    return state;
}

const database = new Database(User, Robot, User);

const store = createStore(
    combineReducers({
        regular: regularReducer,
        database: database.reducer(),
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const actionOne = {
    type: "TEST",
    payload: {},
};

store.dispatch(actionOne);

export default store;
