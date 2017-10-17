import React,{Component} from 'react';
import Entity from './Entity';
import _ from 'lodash';

const Relay = class extends Entity {
    render() {
        if (this.props.config.type == 'relay') {
            var command = 'ON',
                color = 'red';
            /*jshint ignore:start */
            var link = <span title='NO CONNECTION' className="fa fa-power-off relay-cell-img" style={{color:'gray'}}></span>
            /*jshint ignore:end */
            if (this.props.status == 1) {
                command = 'OFF';
                color = 'green';
            }
            if (this.props.online && this.props.connected) {
                /*jshint ignore:start */
                link = <a key={'link_'+this.props.relayboard_id+'_'+this.props.config.number}>
                    <span onClick={this.props.onRelayClick.bind(this,this.props.relayboard_id,command,this.props.config.number)}
                          key={'img_'+this.props.config.number}
                          className="fa fa-power-off relay-cell-img relay-cell-img-online"
                          style={{color:color}}></span>
                </a>
                /*jshint ignore:end */
            }
            return (
                /*jshint ignore:start */
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
                        <button type='button' onClick={this.props.onRelayChartButtonClick.bind(this,this.props.relayboard_id,this.props.config.number)} className="btn btn-default btn-xs">
                            <span className="fa fa-bar-chart"/>
                        </button>
                    </div>
                </td>
                /*jshint ignore:end */
            );
        } else if (this.props.config.type == 'temperature') {
            var status = this.props.status.split('|');
            var temperature = status.shift(),
                humidity = status.pop();
            return (
                /*jshint ignore:start */
                <td key={'column_'+this.props.relayboard_id+'_'+this.props.config.number} className="relay-cell">
                    <div className='relay-cell-text'>
                        {this.props.config.number}
                    </div>
                    <div>
                        <h3><span style={{color:(this.props.online && this.props.connected) ? 'yellow': 'gray'}}>
                            <span className="ion-android-sunny"/>&nbsp;{temperature} C</span>
                        </h3>
                        <h3><span style={{color:(this.props.online && this.props.connected) ? 'cyan': 'gray'}}>
                            <span className="fa fa-tint"/>&nbsp;{humidity} %</span>
                        </h3>
                    </div>
                    <div>
                        {this.props.config.title}
                    </div>
                    <div className="relay-cell-timestamp">
                        <span className="fa fa-clock-o"/>&nbsp;{this.props.timestamp}
                    </div>
                    <div>
                        <button type='button' onClick={this.props.onRelayChartButtonClick.bind(this,this.props.relayboard_id,this.props.config.number)} className="btn btn-default btn-xs">
                            <span className="fa fa-bar-chart"/>
                        </button>
                    </div>
                </td>
                /*jshint ignore:end */
            );
        }
    }
};

export default Relay;