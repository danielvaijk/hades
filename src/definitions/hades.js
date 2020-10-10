// @flow strict
/* eslint-disable flowtype/no-weak-types */
declare type FieldClassType = Class<any>;
declare type TableRowType = {
    id?: number,
    ...
};

declare type ModelFieldsType = {|
    [fieldName: string]: any,
|};
/* eslint-enable flowtype/no-weak-types */
