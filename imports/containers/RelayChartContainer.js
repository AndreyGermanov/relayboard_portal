import { Meteor } from 'meteor/meteor';
import {connect} from 'react-redux';
import RelayChart from '../components/RelayChart';
import dashboardActions from '../actions/DashboardActions';
import moment from 'moment-timezone';

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
                dispatch(dashboardActions.setRelayChartPeriod(ownProps.relayboard_id,ownProps.number,e.target.value));
            }
        },
        onDateStartChange: (value) => {
            dispatch(dashboardActions.setRelayChartDateStart(ownProps.relayboard_id,ownProps.number,value));
        },
        onDateEndChange: (value) => {
            dispatch(dashboardActions.setRelayChartDateEnd(ownProps.relayboard_id,ownProps.number,value));
        },
        onCheckSerie: (serie) => {
            dispatch(dashboardActions.toggleRelayChartSerie(ownProps.relayboard_id,ownProps.number,serie));
        },
        onUpdateClick: () => {
            if (ownProps.period != 'custom') {
                ownProps.settings.dateEnd = moment();
            }
            dispatch(dashboardActions.loadRelayChartData(ownProps));
        }
    };
};

var RelayChartContainer = connect(mapStateToProps,mapDispatchToProps)(RelayChart);

export default RelayChartContainer;