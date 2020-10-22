// @flow strict
declare type StateType = {|
    // eslint-disable-next-line flowtype/no-weak-types
    [key: string]: any,
|};

declare type ActionType = {|
    type: string,
    payload?: PayloadType,
|};

declare type PayloadType = { ... };
declare type ReducerType = (state: StateType, action: ActionType) => StateType;
