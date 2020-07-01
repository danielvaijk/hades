import { createStore, combineReducers } from "redux";

const initialState = {
    apples: 10,
};

function regularReducer(state = initialState, action) {
    return state;
}

const storeBoring = createStore(
    combineReducers({
        regular: regularReducer,
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default storeBoring;
