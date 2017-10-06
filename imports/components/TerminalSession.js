import React,{Component} from 'react';

const TerminalSession = class extends Component {
    render() {
        return (
            <div>
                <div>
                    <pre ref={(item) => { this.terminal_area = item;}}className="terminalSession" dangerouslySetInnerHTML={{__html:this.props.buffer}}></pre>
                </div>
                <input placeholder="Enter command here" className="terminalSession" value={this.props.command}
                       onKeyPress={this.props.onCommandKeyPress.bind(this)}
                       onChange={this.props.onCommandChange.bind(this)}
                />
            </div>
        )
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevProps.buffer.length != this.props.buffer.length) {
            this.terminal_area.scrollTop = this.terminal_area.scrollHeight - this.terminal_area.clientHeight;
        }
    }
}

export default TerminalSession;