// @flow strict
/* global StateType */
/* global ActionType */
import { Table } from "./Table";
import { Session } from "./Session";
import type { Model } from "../model/Model";

/**
 * Type constants.
 */
const TYPE_FUNCTION: string = "function";

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20200718 Initial creation.
 */
class Database {
    _registeredModels: Array<Class<Model>>;

    /**
     * @param {Array<Class<Model>>} models
     *
     * @returns {void}
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

            return session.getState();
        };
    }

    /**
     * @param {Array<Class<Model>>} models
     *
     * @returns {void}
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

        this._registeredModels = models.reduce(
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

        session.addModels(this._registeredModels);
        this._registeredModels.forEach((ModelClass: Class<Model>): void => {
            ModelClass.addSession(session);
        });

        return session;
    }

    /**
     * @param {Session} session
     *
     * @returns {void}
     */
    _forModelsInSessionCreateTablesIfNeeded(session: Session): void {
        session.getModels().forEach((ModelClass: Class<Model>): void => {
            const tableKeyOrNull:
                | string
                | null = ModelClass.getTableKeyOrNull();

            if (tableKeyOrNull && session.getState()[tableKeyOrNull]) {
                // Table already exists.
            } else {
                const table: Table = new Table(ModelClass);
                const tableKey: string = table.getKey();

                ModelClass.addTableKey(tableKey);
                ModelClass.addIdentifierKey(table.getIdentifierKey());

                session.mergeIntoState({ [tableKey]: table });
            }
        });
    }

    /**
     * @param {Session} session
     * @param {ActionType} action
     *
     * @returns {void}
     */
    _forModelsInSessionApplyReducers(
        session: Session,
        action: ActionType
    ): void {
        session.getModels().forEach((ModelClass: Class<Model>): void => {
            if (typeof ModelClass.reducer === TYPE_FUNCTION) {
                ModelClass.reducer(action);
            } else {
                // No reducer defined for this model.
            }
        });
    }

    /**
     * @param {string} modelName
     *
     * @returns {void}
     */
    _createWarningDuplicateModel(modelName: string): void {
        console.warn(`Tried to register duplicate Model: '${modelName}'.`);
    }
}

export { Database };
