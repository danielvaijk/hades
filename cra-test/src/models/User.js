import { Model } from "hades";

class User extends Model {
    /**
     * @returns {string}
     */
    static toString() {
        return "User";
    }

    /**
     * @returns {Object}
     */
    static fields() {
        return {
            name: String,
            age: Number,
        };
    }

    /**
     * @param {Object} action
     */
    static reducer(action) {
        switch (action.type) {
            case "CREATE USER": {
                User.create(action.payload);
                break;
            }

            case "UPDATE USER": {
                const user = User.withId(action.payload.id);

                user.update(action.payload.fields);
                break;
            }

            case "UPSERT USER": {
                User.upsert(action.payload.fields);
                break;
            }

            case "DELETE USER": {
                const user = User.withId(action.payload.id);

                user.delete();
                break;
            }

            default: {
                // Ignore this action.
                break;
            }
        }
    }
}

export default User;
