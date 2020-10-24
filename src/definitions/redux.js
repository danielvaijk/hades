// @flow strict
/* eslint-disable flowtype/no-weak-types */
declare type StateType = {|
    [key: string]: any,
|};

declare type PayloadType = {|
    [key: string]: any,
|};
/* eslint-enable flowtype/no-weak-types */

declare type ActionType = {|
    type: string,
    payload?: PayloadType,
|};

declare type ReducerType = (state: StateType, action: ActionType) => StateType;
