import Model from "../Model";

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
     * @param {Object} session
     * @param {Object} action
     *
     * @returns {Object|undefined}
     */
    static reducer(session, action) {
        return undefined;
    }
}

export default Robot;
