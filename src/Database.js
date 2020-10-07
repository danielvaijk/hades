// @flow strict
import { Table } from "./Table";
import { Model } from "./Model";
import { Session } from "./Session";

type StateType = { ... };
type ActionType = {|
    type: string,
    payload?: { ... },
|};

/**
 * Type constants.
 */
const TYPE_FUNCTION: string = "function";

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20200718 Initial creation.
 */
class Database {
    registeredModels: Array<Class<Model>>;

    /**
     * @param {Array<Class<Model>>} models
     */
    constructor(...models: Array<Class<Model>>): void {
        this._registerModels(models);
    }

    /**
     * @returns {Function}
     */
    reducer(): (state: StateType, action: ActionType) => StateType {
        /**
         * @param {StateType} [state]
         * @param {ActionType} action
         *
         * @returns {StateType}
         */
        return (state: StateType = {}, action: ActionType): StateType => {
            const session: Session = this._createSession(state);

            this._forModelsInSessionCreateTablesIfNeeded(session);
            this._forModelsInSessionApplyReducers(session, action);

            return session.state;
        };
    }

    /**
     * @param {Array<Class<Model>>} models
     */
    _registerModels(models: Array<Class<Model>>): void {
        /**
         * @param {Array<Class<Model>>} uniqueModels
         * @param {Class<Model>} ModelClass
         *
         * @this Database
         *
         * @returns {Array<Class<Model>>}
         */
        function uniqueModelReducer(
            uniqueModels: Array<Class<Model>>,
            ModelClass: Class<Model>
        ): Array<Class<Model>> {
            if (uniqueModels.includes(ModelClass)) {
                this._createWarningDuplicateModel(ModelClass.toString());
            } else {
                uniqueModels.push(ModelClass);
            }

            return uniqueModels;
        }

        this.registeredModels = models.reduce(
            uniqueModelReducer.bind(this),
            []
        );
    }

    /**
     * @param {StateType} state
     *
     * @returns {Session}
     */
    _createSession(state: StateType): Session {
        const session: Session = new Session(state);

        session.addModels(this.registeredModels);
        this.registeredModels.forEach((ModelClass: Class<Model>): void => {
            ModelClass.addSession(session);
        });

        return session;
    }

    /**
     * @param {Session} session
     */
    _forModelsInSessionCreateTablesIfNeeded(session: Session): void {
        session.models.forEach((ModelClass: Class<Model>): void => {
            const tableKeyOrNull:
                | string
                | null = ModelClass.getTableKeyOrNull();

            if (tableKeyOrNull && session.state[tableKeyOrNull]) {
                // Table already exists.
            } else {
                const table: Table = new Table(ModelClass);
                const tableKey: string = table.getKey();

                ModelClass.addTableKey(tableKey);
                session.mergeIntoState({ [tableKey]: table });
            }
        });
    }

    /**
     * @param {Session} session
     * @param {ActionType} action
     */
    _forModelsInSessionApplyReducers(
        session: Session,
        action: ActionType
    ): void {
        session.models.forEach((ModelClass: Class<Model>): void => {
            if (typeof ModelClass.reducer === TYPE_FUNCTION) {
                ModelClass.reducer(action);
            } else {
                // No reducer defined for this model.
            }
        });
    }

    /**
     * @param {string} modelName
     */
    _createWarningDuplicateModel(modelName: string): void {
        console.warn(`Tried to register duplicate Model: '${modelName}'.`);
    }
}

export { Database };
export type { StateType, ActionType };
