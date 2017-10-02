import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import 'react-blur-admin/dist/assets/styles/react-blur-admin.min.css';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import App from '../imports/containers/AppContainer';
import React from 'react';
import { render } from 'react-dom';
import {Provider} from 'react-redux-meteor';
import Store from '../imports/store/Store';
import './main.html';
Meteor.startup(() => {
    /*jshint ignore:start */
    render(<Provider store={Store.store}><App/></Provider>, document.getElementById('app'));
    /*jshint ignore:end */
});


