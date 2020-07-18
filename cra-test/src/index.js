import React from "react";
import ReactDOM from "react-dom";
import { Database } from "hades";
import { createStore, combineReducers } from "redux";

import "./index.css";
import App from "./App";
import User from "./models/User";
import Robot from "./models/Robot";
import * as serviceWorker from "./serviceWorker";

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

const createUser = (name, age) => ({
    type: "CREATE USER",
    payload: { age, name },
});

const updateUser = (id, fields) => ({
    type: "UPDATE USER",
    payload: { id, fields },
});

const deleteUserById = (id) => ({
    type: "DELETE USER",
    payload: { id },
});

store.dispatch(createUser("Daniel", 22));
store.dispatch(createUser("John", 43));
store.dispatch(deleteUserById(1));
store.dispatch(updateUser(2, { age: 18 }));

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
