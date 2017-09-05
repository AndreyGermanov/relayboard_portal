import { Meteor } from 'meteor/meteor';
import Application from '../imports/core/Application';

Meteor.startup(() => {
    Application.run();
});
