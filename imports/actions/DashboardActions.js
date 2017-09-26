var DashboardActions = class {

    constructor() {
        this.types = {
            SET_CURRENT_RELAYBOARD_CHART: 'SET_CURRENT_RELAYBOARD_CHART'
        }
    }

    setCurrentRelayboardChart(relayboard_id,index) {
        return {
            type: this.types.SET_CURRENT_RELAYBOARD_CHART,
            relayboard_id: relayboard_id,
            index: index
        }
    }
}

export default new DashboardActions();