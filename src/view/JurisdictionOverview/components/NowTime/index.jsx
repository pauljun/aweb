import React, { Component } from 'react';
import moment from 'moment';

class NowTime extends Component {
    state = {
        nowTime: moment().format('YYYY.MM.DD HH:mm:ss'),
    }
    componentDidMount() {       
        this.timer = setInterval(() => {
            this.setState({
                nowTime: moment().format('YYYY.MM.DD HH:mm:ss')
            })
        }, 1000)
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }


    render() {
        return (
            <span style={{ marginLeft: '20px' }}>{this.state.nowTime}</span>
        )
    }
}
export default NowTime;