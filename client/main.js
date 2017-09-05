import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import 'react-blur-admin/dist/assets/styles/react-blur-admin.min.css';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
import App from '../imports/components/App';
import React from 'react'
import { render } from 'react-dom';
import './main.html';
Meteor.startup(() => {
    render(<App/>, document.getElementById('app'));
});


