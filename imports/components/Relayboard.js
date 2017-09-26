import React,{Component} from 'react';
import _ from 'lodash';
import RelayContainer from '../containers/RelayContainer';
import RelayChartContainer from '../containers/RelayChartContainer';

const Relayboard = class extends Component {
    render() {
        var relay_columns = null,
            relayboard = this.props.relayboard;
        if (relayboard.status && relayboard.config) {
            relay_columns = relayboard.status.split(',').map(function (status, index) {
                return <RelayContainer key={'relayboard_'+relayboard._id+'_'+relayboard.config.pins[index].number}
                                       status={status}
                                       timestamp={relayboard.timestamp}
                                       config={relayboard.config.pins[index]}
                                       index={index}
                                       relayboard_id={relayboard._id}
                                       online={relayboard.online}
                />
            });
        }
        var relay_chart = null;
        if (this.props.current_relay!==null) {
            relay_chart = <RelayChartContainer relayboard_id={relayboard._id} number={relayboard.config.pins[this.props.current_relay].number} config={relayboard.config.pins[this.props.current_relay]}/>
        };
        return (
            <div className="panel panel-blur" style={{flex:1}} key={relayboard._id}>
                <div className="panel-heading">
                    <h3 className="panel-title">{relayboard.title ? relayboard.title : relayboard._id}
                <span className="pull-right">
                    <button type='button' onClick={this.props.onRemoveRelayboardClick.bind(this,relayboard._id)} className="btn btn-default btn-xs">
                        <span className="fa fa-remove"/>&nbsp;Remove
                    </button>
                </span>
                    </h3>
                </div>
                <div className="panel-body">
                    <table>
                        <tbody>
                        <tr>
                            {relay_columns}
                        </tr>
                        </tbody>
                    </table>
                </div>
                {relay_chart}
            </div>
        );
    }
};

export default Relayboard;