var ResetPasswordFormActions = class {

    constructor() {
        this.types = {
            CHANGE_PASSWORD_FIELD: 'CHANGE_RESET_PASSWORD_PASSWORD__FIELD',
            CHANGE_CONFIRM_PASSWORD_FIELD: 'CHANGE_RESET_PASSWORD_CONFIRM_PASSWORD__FIELD',
            SET_ERROR_MESSAGES: 'SET_RESET_PASSWORD_LINK_ERROR_MESSAGES',
            SET_CONFIRMED: 'SET_RESET_PASSWORD_CONFIRMED'
        }
    }

    changePasswordField(value) {
        return {
            type: this.types.CHANGE_PASSWORD_FIELD,
            value: value
        }
    }

    changeConfirmPasswordField(value) {
        return {
            type: this.types.CHANGE_CONFIRM_PASSWORD_FIELD,
            value: value
        }
    }

    setErrorMessages(errors) {
        return {
            type: this.types.SET_ERROR_MESSAGES,
            errors: errors
        }
    }
}

export default new ResetPasswordFormActions();