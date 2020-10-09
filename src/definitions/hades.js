// @flow strict
declare type TableRowType = {
    id?: number,
    ...
};

declare type ModelFieldsType = {|
    // eslint-disable-next-line flowtype/no-weak-types
    [fieldName: string]: any,
|};
