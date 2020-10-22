// @flow strict
import type { Table } from "../../database/Table";
import { Database } from "../../database/Database";
import { UserModel } from "../mock/models/UserModel";
import { UserActionsLib } from "../mock/store/actions/UserActionsLib";

/**
 * Test user constants.
 */
const TEST_USER_AGE: number = 22;
const TEST_USER_NAME: string = "Daniel";

test("Created a Model instance via action dispatch.", (): void => {
    const database: Database = new Database(UserModel);
    const reducer: ReducerType = database.reducer();

    const userCreateAction: ActionType = UserActionsLib.create({
        age: TEST_USER_AGE,
        name: TEST_USER_NAME,
    });

    const stateInitial: StateType = {};
    const stateMutated: StateType = reducer(stateInitial, userCreateAction);

    const userTable: Table = stateMutated.table_usermodel;
    const userTableRows: RowStorageType = userTable.getRows();

    expect(userTableRows["1"].name).toBe(TEST_USER_NAME);
});
