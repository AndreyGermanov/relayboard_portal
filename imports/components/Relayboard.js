import React,{Component} from 'react';
import {Page,Tab,Tabs} from 'react-blur-admin';
import Entity from './Entity';
import _ from 'lodash';
import RelayContainer from '../containers/RelayContainer';
import TerminalSessionContainer from '../containers/TerminalSessionContainer';
import RelayChartContainer from '../containers/RelayChartContainer';

const Relayboard = class extends Entity {
    
    render() {
        var relay_columns = null,
            relayboard = this.props.relayboard;
        if (relayboard.status && relayboard.config) {
            relay_columns = relayboard.status.split(',').map(function (status, index) {
                /*jshint ignore:start */
                return <RelayContainer key={'relayboard_'+relayboard._id+'_'+relayboard.config.pins[index].number}
                                       status={status}
                                       timestamp={relayboard.timestamp}
                                       config={relayboard.config.pins[index]}
                                       index={index}
                                       relayboard_id={relayboard._id}
                                       online={relayboard.online}
                />
                /*jshint ignore:end */
            });
        }
        var relay_chart = null;
        if (this.props.current_relay!==null && typeof(this.props.current_relay) != 'undefined') {
            /*jshint ignore:start */
            relay_chart = <RelayChartContainer relayboard_id={relayboard._id} number={this.props.current_relay}
                                               config={_.find(relayboard.config.pins,{number:this.props.current_relay})}
            settings={relayboard.relayChartSettings[this.props.current_relay]} />
            /*jshint ignore:end */
        }
        return (
            /*jshint ignore:start */
            <div className="panel panel-blur" style={{flex:1}} key={relayboard._id}>
                <div className="panel-heading">
                    <h3 className="panel-title">{relayboard.config.title ? relayboard.config.title : relayboard._id}
                <span className="pull-right">
                    <button type='button' onClick={this.props.onRemoveRelayboardClick.bind(this,relayboard._id)} className="btn btn-default btn-xs">
                        <span className="fa fa-remove"/>&nbsp;Remove
                    </button>
                </span>
                    </h3>
                </div>
                <div className="panel-body">
                    <Tabs align="top" startTab={1} size="auto">
                        <Tab title="Status">
                            <table>
                                <tbody>
                                <tr>
                                    {relay_columns}
                                </tr>
                                </tbody>
                            </table>
                            {relay_chart}
                        </Tab>
                        <Tab title="Manage">
                            <TerminalSessionContainer relayboard={relayboard}/>
                        </Tab>
                    </Tabs>
                </div>
            </div>
            /*jshint ignore:end */
        );
    }
};

export default Relayboard;