var LoginFormActions = class {

    constructor() {
        this.types = {
            CHANGE_EMAIL_FIELD: 'CHANGE_EMAIL_FIELD',
            CHANGE_PASSWORD_FIELD: 'CHANGE_PASSWORD_FIELD',
            SET_ERROR_MESSAGES: 'SET_ERROR_MESSAGES'
        };
    }

    changeEmailField(value) {
        return {
            type: this.types.CHANGE_EMAIL_FIELD,
            value: value
        };
    }

    changePasswordField(value) {
        return {
            type: this.types.CHANGE_PASSWORD_FIELD,
            value: value
        };
    }

    setErrorMessages(errors) {
        return {
            type: this.types.SET_ERROR_MESSAGES,
            errors: errors
        };
    }
};

export default new LoginFormActions();