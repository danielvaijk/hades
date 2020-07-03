import Model from "../Model";

class User extends Model {
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
        session.state.users = session.state.users ? session.state.users + 1 : 1;
    }
}

export default User;
