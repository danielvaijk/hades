// @flow strict
import { UserModel } from "../mock/models/UserModel";
import type { Table } from "../../src/database/Table";
import { Database } from "../../src/database/Database";
import { UserActionsLib } from "../mock/store/actions/UserActionsLib";

/**
 * Test user constants.
 */
const TEST_USER_AGE: number = 22;
const TEST_USER_NAME: string = "Daniel";

test("Created a Model instance via action dispatch.", (): void => {
    const database: Database = new Database(UserModel);
    const reducer: ReducerType = database.reducer();

    const userData: PayloadType = { age: TEST_USER_AGE, name: TEST_USER_NAME };
    const userCreateAction: ActionType = UserActionsLib.create(userData);

    const stateInitial: StateType = {};
    const stateMutated: StateType = reducer(stateInitial, userCreateAction);

    expect(stateInitial).not.toEqual(stateMutated);

    const userTable: Table = stateMutated.table_usermodel;
    const userTableRows: RowStorageType = userTable.getRows();

    expect(Object.values(userTableRows).length).toBe(1);
    expect(userTableRows["1"].name).toEqual(userData.name);
});
