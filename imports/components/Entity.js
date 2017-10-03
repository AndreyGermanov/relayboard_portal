import React,{Component} from 'react';

var Entity = class extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        for (var i in nextProps) {
            if (!_.isEqual(this.props[i], nextProps[i]) && typeof(this.props[i])!='function') {
                return true;
            }
        }
        return false;
    }
};

export default Entity;