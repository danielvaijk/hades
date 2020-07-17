import { Model } from "hades";

class Robot extends Model {
    /**
     * @returns {string}
     */
    static toString() {
        return "Robot";
    }

    fields() {
        return {
            name: String,
            age: Number,
        };
    }

    /**
     * @param {Object} action
     */
    static reducer(action) {
        switch (action) {
            default:
                // Ignore this action.
                break;
        }
    }
}

export default Robot;
