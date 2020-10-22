// @flow strict
/* global ActionType */
import { Model } from "../../../src/model/Model";
import { Schema } from "../../../src/model/Schema";
import { UserActionsLib } from "../../mock/store/actions/UserActionsLib";

/**
 * Model constants.
 */
const MODEL_NAME: string = "UserModel";

/**
 * @author Daniel van Dijk <daniel@invidiacreative.net>
 * @since 20201022 Initial creation.
 */
class UserModel extends Model {
    /**
     * @returns {string}
     */
    static toString(): string {
        return MODEL_NAME;
    }

    /**
     * @returns {Schema}
     */
    static fields(): Schema {
        // $FlowIgnore FIXME:
        return new Schema({
            age: Number,
            name: String,
        });
    }

    /**
     * @param {ActionType} action
     *
     * @returns {void}
     */
    static reducer(action: ActionType): void {
        switch (action.type) {
            case UserActionsLib.getActionTypeUserCreate():
                if (action.payload) {
                    // $FlowIgnore FIXME:
                    UserModel.create(action.payload);
                } else {
                    // Payload not defined.
                }
                break;

            default:
                // Do nothing.
                break;
        }
    }
}

export { UserModel };
