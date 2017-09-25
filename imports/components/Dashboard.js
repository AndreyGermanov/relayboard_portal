import React,{Component} from 'react';
import _ from 'lodash';

const Dashboard = class extends Component {
        render() {
            var relayboards =  this.props.relayboards.map(function(relayboard) {
                if (relayboard.status && relayboard.config) {
                    var pin_config = relayboard.config.pins;
                    var relay_columns = relayboard.status.split(',').map(function (relay, index) {
                        if (pin_config[index].type == 'relay') {
                            var command = 'ON',
                                color = 'red',
                                link = <span className="fa fa-power-off relay-cell-img" style={{color:'gray'}}></span>
                            if (relay == 1) {
                                command = 'OFF';
                                color = 'green';
                            }
                            ;
                            if (relayboard.online) {
                                link = <a key={'link_'+index}>
                                    <span onClick={this.props.onRelayClick.bind(this,relayboard._id,command,pin_config[index].number)}
                                          key={'img_'+index}
                                          className="fa fa-power-off relay-cell-img relay-cell-img-online"
                                          style={{color:color}}></span>
                                </a>
                            }
                            ;
                            return (
                                <td key={'column_'+index} className="relay-cell">
                                    <div className='relay-cell-text'>
                                        {pin_config[index].number}
                                    </div>
                                    <div>
                                        {link}
                                    </div>
                                    <div>
                                        {pin_config[index].title}
                                    </div>
                                </td>
                            )
                        } else {
                            relay = relay.split('|');
                            var temperature = relay.shift(),
                                humidity = relay.pop();
                            return (
                                <td key={'column_'+index} className="relay-cell">
                                    <div className='relay-cell-text'>
                                        {pin_config[index].number}
                                    </div>
                                    <div>
                                        <h3><span style={{color:'yellow'}}><span className="ion-android-sunny"/>&nbsp;{temperature} C</span></h3>
                                        <h3><span style={{color:'cyan'}}><span className="fa fa-tint"/>&nbsp;{humidity} %</span></h3>
                                    </div>
                                    <div>
                                        {pin_config[index].title}
                                    </div>
                                </td>
                            )
                        }
                    }, this);
                } else {
                    var relay_columns = null;
                };
                return (
                    <div className="panel panel-blur" style={{flex:1}} key={relayboard._id}>
                        <div className="panel-heading">
                            <h3 className="panel-title">{relayboard.title ? relayboard.title : relayboard._id}
                        <span className="pull-right">
                            <button type='button' onClick={this.props.onRemoveRelayboardClick.bind(this,relayboard._id)} className="btn btn-default btn-xs"><span className="fa fa-remove"/>&nbsp;Remove</button>
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
                    </div>
                );
            },this);

            return (
                <div>
                    <div className="content-top clearfix">
                        <h1 className="al-title">Dashboard</h1>
                    </div>
                    <div className="flexbox">
                        {relayboards}
                    </div>
                </div>
            )


        }
    componentDidMount() {
        
    }
}

export default Dashboard;