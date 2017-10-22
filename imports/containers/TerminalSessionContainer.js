import {Meteor} from 'meteor/meteor';
import {connect} from 'react-redux';
import TerminalSession from '../components/TerminalSession';
import actions from '../actions/DashboardActions';

const mapStateToProps = (state,ownProps) => {
    return {
        command: ownProps.relayboard.terminal_command,
        buffer: ownProps.relayboard.terminal_buffer.join('<br/>')
    };
};

const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        onCommandKeyPress: (e) => {
            const code = e.which || e.keyCode;
            if (code == 13) {
                dispatch(actions.sendTerminalCommand(ownProps.relayboard._id));
            }
        },
        onCommandChange: (e) => {
            dispatch(actions.setTerminalCommand(ownProps.relayboard._id,e.target.value));
        }
    };
};

const TerminalSessionContainer = connect(mapStateToProps,mapDispatchToProps)(TerminalSession);

export default TerminalSessionContainer;