// @flow strict
/* global ActionType */
/* global PayloadType */

/**
 * Action type constants.
 */
const ACTION_TYPE_USER_CREATE: string = "CREATE_USER";

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20201022 Initial creation.
 */
class UserActionsLib {
    /**
     * @returns {string}
     */
    static getActionTypeUserCreate(): string {
        return ACTION_TYPE_USER_CREATE;
    }

    /**
     * @param {PayloadType} data
     *
     * @returns {ActionType}
     */
    static create(data: PayloadType): ActionType {
        return {
            payload: data,
            type: this.getActionTypeUserCreate(),
        };
    }
}

export { UserActionsLib };
