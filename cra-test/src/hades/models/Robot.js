import Model from "../Model";

class Robot extends Model {
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
     * @returns {Object}
     */
    static reducer(session, action) {
        session.state.robots = session.state.robots
            ? session.state.robots + 1
            : 1;
    }
}

export default Robot;
