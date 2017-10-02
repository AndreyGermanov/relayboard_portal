var AppActions = class {

    constructor() {
        this.types = {
            TOGGLE_SIDE_MENU: 'TOGGLE_SIDE_MENU',
            TOGGLE_USER_MENU: 'TOGGLE_USER_MENU'
        };
    }

    toggleSideMenu() {
        return {
            type: this.types.TOGGLE_SIDE_MENU
        };
    }

    toggleUserMenu(value) {
        return {
            type: this.types.TOGGLE_USER_MENU,
            value: value
        };
    }
};

export default new AppActions();