import { Meteor } from 'meteor/meteor';
import {connect} from 'react-redux-meteor';
import SensorDataModel from '../models/SensorData';
import RelayChart from '../components/RelayChart';
import dashboardActions from '../actions/DashboardActions';

Meteor.subscribe('sensor_data');

const mapStateToProps = (state,ownProps) => {
    return {
        relayboard_id: ownProps.relayboard_id,
        config: ownProps.config,
        number: ownProps.number,
        period: ownProps.settings.period,
        dateStart: ownProps.settings.dateStart,
        dateEnd: ownProps.settings.dateEnd,
        series: ownProps.settings.series,
        sensor_data: state.Dashboard.relayboards[ownProps.relayboard_id].sensor_data[ownProps.number]
    };
};

const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        onCloseClick: (e) => {
            e.preventDefault();
            dispatch(dashboardActions.setCurrentRelayboardChart(ownProps.relayboard_id,null));
        },
        onPeriodChange: (e) => {
            if (e && e.target) {
                dispatch(dashboardActions.setRelayChartPeriod(ownProps.relayboard_id,ownProps.number,e.target.value))
            }
        },
        onCheckSerie: (serie) => {
            dispatch(dashboardActions.toggleRelayChartSerie(ownProps.relayboard_id,ownProps.number,serie));
        },
        onUpdateClick: () => {
            dispatch(dashboardActions.loadRelayChartData(ownProps));
        }
    };
};

var RelayChartContainer = connect(null,mapStateToProps,mapDispatchToProps)(RelayChart);

export default RelayChartContainer;