import React,{Component} from 'react';
import Entity from './Entity';
import RelayboardContainer from '../containers/RelayboardContainer';
import Store from '../store/Store';

const Dashboard = class extends Entity {
    render() {
        if (this.props.relayboards) {
            var state_relayboards = _.toArray(this.props.relayboards);
            var relayboards = state_relayboards.map(function (relayboard) {
                if (Store.store.getState().Dashboard.relayboards[relayboard._id]) {
                    relayboard.relayChartSettings = Store.store.getState().Dashboard.relayboards[relayboard._id].relayChartSettings;
                }
                /*jshint ignore:start */
                return <RelayboardContainer key={'relayboard_'+relayboard._id} relayboard={relayboard}/>;
                /*jshint ignore:end */
            }, this);
            return (
                /*jshint ignore:start */
                <div>
                    <div className="flexbox">
                        {relayboards}
                    </div>
                </div>
                /*jshint ignore:end */
            );
        } else {
            /*jshint ignore:start */
            return <div>Loading ...</div>;
            /*jshint ignore:end */
        }
    }
};

export default Dashboard;