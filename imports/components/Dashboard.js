import React,{Component} from 'react';
import RelayboardContainer from '../containers/RelayboardContainer';

const Dashboard = class extends Component {
    render() {
        var relayboards =  this.props.relayboards.map(function(relayboard) {
            return <RelayboardContainer key={'relayboard_'+relayboard._id} relayboard={relayboard}/>
        },this);
        return (
            <div>
                <div className="flexbox">
                    {relayboards}
                </div>
            </div>
        )
    }
};

export default Dashboard;