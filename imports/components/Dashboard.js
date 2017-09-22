import React,{Component} from 'react';
import _ from 'lodash';

const Dashboard = class extends Component {
        render() {
            var relayboards =  this.props.relayboards.map(function(relayboard) {
                if (!relayboard.status) {
                    return null;
                }
                var relay_columns = relayboard.status.split(',').map(function(relay,index) {
                    var command = 'ON',
                        color = 'red',
                        link = <span className="fa fa-power-off relay-cell-img" style={{color:'gray'}}></span>
                    if (relay==1) {
                        command = 'OFF';
                        color = 'green';
                    };
                    if (relayboard.online) {
                        link = <a  key={'link_'+index}>
                            <span onClick={this.props.onRelayClick.bind(this,relayboard._id,command,index+1)} key={'img_'+index} className="fa fa-power-off relay-cell-img relay-cell-img-online" style={{color:color}}></span>
                        </a>
                    };
                    return (
                        <td key={'column_'+index} className="relay-cell">
                            <div className='relay-cell-text'>
                                {index+1}
                            </div>
                            <div>
                                {link}
                            </div>
                            <div>
                                <input  key={'input_'+index} className="form-control"/>
                            </div>
                        </td>
                    )
                },this);
                return (
                    <div className="panel panel-blur" style={{flex:1}} key={relayboard._id}>
                        <div className="panel-heading">
                            <h3 className="panel-title">My relayboard
                        <span className="pull-right">
                            <button type='button' className="btn btn-default btn-xs"><span className="fa fa-save"/>&nbsp;Save changes</button>
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