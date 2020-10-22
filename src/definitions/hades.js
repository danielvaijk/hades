// @flow strict
/* eslint-disable flowtype/no-weak-types */
declare type FieldClassType = Class<any>;
declare type ModelIdentifierType = string | number;

declare type TableRowType = {
    id?: ModelIdentifierType,
    ...
};

declare type RowStorageType = {|
    [key: ModelIdentifierType]: any,
|};

declare type ModelFieldsType = {|
    [fieldName: string | number]: any,
|};
/* eslint-enable flowtype/no-weak-types */
