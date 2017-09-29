var ResetPasswordLinkFormActions = class {

    constructor() {
        this.types = {
            CHANGE_EMAIL_FIELD: 'CHANGE_RESET_PASSWORD_LINK_EMAIL_FIELD',
            SET_ERROR_MESSAGES: 'SET_RESET_PASSWORD_LINK_ERROR_MESSAGES',
            SET_EMAIL_SENT: 'SET_RESET_PASSWORD_LINK_EMAIL_SENT'
        };
    }

    changeEmailField(value) {
        return {
            type: this.types.CHANGE_EMAIL_FIELD,
            value: value
        };
    }

    setErrorMessages(errors) {
        return {
            type: this.types.SET_ERROR_MESSAGES,
            errors: errors
        };
    }

    setEmailSent() {
        return {
            type: this.types.SET_EMAIL_SENT
        };
    }
};

export default new ResetPasswordLinkFormActions();