import React,{Component} from 'react';
import _ from 'lodash';

const Relay = class extends Component {
    render() {
        if (this.props.config.type == 'relay') {
            var command = 'ON',
                color = 'red',
                link = <span className="fa fa-power-off relay-cell-img" style={{color:'gray'}}></span>
            if (this.props.status == 1) {
                command = 'OFF';
                color = 'green';
            }
            ;
            if (this.props.online) {
                link = <a key={'link_'+this.props.relayboard_id+'_'+this.props.config.number}>
                    <span onClick={this.props.onRelayClick.bind(this,this.props.relayboard_id,command,this.props.config.number)}
                          key={'img_'+this.props.config.number}
                          className="fa fa-power-off relay-cell-img relay-cell-img-online"
                          style={{color:color}}></span>
                </a>
            }
            ;
            return (
                <td key={'column_'+this.props.relayboard_id+'_'+this.props.config.number} className="relay-cell">
                    <div className='relay-cell-text'>
                        {this.props.config.number}
                    </div>
                    <div>
                        {link}
                    </div>
                    <div>
                        {this.props.config.title}
                    </div>
                    <div className="relay-cell-timestamp">
                        <span className="fa fa-clock-o"/>&nbsp;{this.props.timestamp}
                    </div>
                    <div>
                        <button type='button' onClick={this.props.onRelayChartButtonClick.bind(this,this.props.relayboard_id,this.props.index)} className="btn btn-default btn-xs">
                            <span className="fa fa-bar-chart"/>
                        </button>
                    </div>
                </td>
            )
        } else if (this.props.config.type == 'temperature') {
            var status = this.props.status.split('|');
            var temperature = status.shift(),
                humidity = status.pop();
            return (
                <td key={'column_'+this.props.relayboard_id+'_'+this.props.config.number} className="relay-cell">
                    <div className='relay-cell-text'>
                        {this.props.config.number}
                    </div>
                    <div>
                        <h3><span style={{color:'yellow'}}><span className="ion-android-sunny"/>&nbsp;{temperature} C</span></h3>
                        <h3><span style={{color:'cyan'}}><span className="fa fa-tint"/>&nbsp;{humidity} %</span></h3>
                    </div>
                    <div>
                        {this.props.config.title}
                    </div>
                    <div className="relay-cell-timestamp">
                        <span className="fa fa-clock-o"/>&nbsp;{this.props.timestamp}
                    </div>
                    <div>
                        <button type='button' onClick={this.props.onRelayChartButtonClick.bind(this,this.props.relayboard_id,this.props.index)} className="btn btn-default btn-xs">
                            <span className="fa fa-bar-chart"/>
                        </button>
                    </div>
                </td>
            )
        }
    }
}

export default Relay;