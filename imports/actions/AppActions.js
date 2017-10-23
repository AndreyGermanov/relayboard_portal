var AppActions = class {

    constructor() {
        this.types = {
            TOGGLE_SIDE_MENU: 'TOGGLE_SIDE_MENU',
            TOGGLE_USER_MENU: 'TOGGLE_USER_MENU',
            MOUSE_UP: 'MOUSE_UP'
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

    mouseUp() {
        return {
            type: this.types.MOUSE_UP
        };
    }
};

export default new AppActions();