import {createStore,applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';
import RootReducer from '../reducers/RootReducer';
import createBrowserHistory from 'history/createBrowserHistory';

var Store = class {
    constructor() {
        this.browserHistory = createBrowserHistory();
        this.store = createStore(RootReducer,applyMiddleware(thunkMiddleware));
    }
};

export default new Store();