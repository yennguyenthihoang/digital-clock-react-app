import React, { Component } from 'react';
import { PropTypes } from 'prop-types'; 
import moment from 'moment-timezone';
import './clock-locales';
import '../styles/App.css';

class Clock extends Component { 
    constructor(props) {
        super(props);
    
        /* Set Default Props Values */
        if (this.props.config.id === undefined) { this.props.config.id = `pixelfactory-${this.props.config.city}` }
        if (this.props.config.showCity === undefined) { this.props.config.showCity = true }
        if (this.props.config.locale === undefined) { this.props.config.locale = 'en' }
        if (this.props.config.showTimezone === undefined) { this.props.config.showTimezone = true }
        /*Use 12 hour clock to show AM/PM, default is false */
        if (this.props.config.meridiem === undefined) { this.props.config.meridiem = false }
    
        /* Set Initlal State */
        const {hours, minutes, seconds, meridiem, timezone} = this.getMoment(this.props.config.timezone, this.props.config.locale);
        this.state = {
          currentDate: this.getMoment(this.props.config.timezone, this.props.config.locale),
          hours: hours,
          minutes: minutes,
          seconds: seconds,
          mode: 0,
          meridiem: false,
          light: false,
        };
    }

    componentDidMount() {
        const tic = setInterval(() => {
          this.setState({
            currentDate: this.getMoment(this.props.config.timezone, this.props.config.locale),
            hours: this.state.hours,
            minutes: this.state.minutes,
            seconds: this.state.seconds,
            mode: this.state.mode,
            light: this.state.light,
          });
        }, 1000);
    
        this.setState({ tic });
    }

    componentWillUnmount() {
        clearInterval(this.state.tic);
    }

    getMoment(timezone, locale) {
        moment.locale(locale);
        const now = moment().tz(timezone);
        const tz = moment().tz(timezone).format('z');
    
        // Time
        let hours = now.get('hour');
        const meridiem = (hours < 12) ? 'AM' : 'PM';
        hours = (this.props.config.meridiem && meridiem === 'PM') ? (hours - 12) : hours;
        const minutes = now.get('minute');
        const seconds = now.get('second');
    
        // return time object
        return {
          hours: (hours < 10 ? '0' : '') + hours,
          minutes: (minutes < 10 ? '0' : '') + minutes,
          seconds: (seconds < 10 ? '0' : '') + seconds,
          meridiem: meridiem,
          timezone: tz
        };
    }

    /**
     * State Mode value default is 0, 1 is hour editable, 2 is minute editable
     */
    pressModeBtn() {
        let newMode = (this.state.mode + 1)%3;
        this.setState({
            mode: newMode
        });
    }

    /**
     * Light Mode is on: true
     * Light mode is off: false
     */
     pressLightBtn() {
        this.setState({
            light: !this.state.light
        });
    }

    /**
     * Mode is 0: do nothing
     * Mode is 1: increase hour
     * Mode is 2: increase minute
     */
    pressIncreaseBtn() {

        switch(this.state.mode){
            case 1:
                let newHours = this.state.hours + 1;
                this.setState({
                    hours: newHours
                });
                break;
            case 2:
                let newMinutes = this.state.minutes + 1;
                this.setState({
                    minutes: newMinutes
                });
                break;
            default:
                break;
        }

        this.setState({
            currentDate: this.getMoment(this.props.config.timezone, this.props.config.locale),

        });
    }

    reset() {
        this.setState({
            currentDate: this.getMoment(this.props.config.timezone, this.props.config.locale),
        });
    }

    resetMeridiem() {
        this.setState({
            meridiem: !this.state.meridiem
        });
    }

    render() {
        const { config } = this.props;
        const {
        hours,
        minutes,
        seconds,
        timezone,
        meridiem
        } = this.state.currentDate;

        return (
            <div id={config.id} className="clock">
                {config.showCity ? <h1 className="city">{config.city}</h1> : null}
                {config.showTimezone ? <h2 className="timezone">{config.timezone} {timezone}</h2> : null}
                <div className="button">
                    <button className="button mode-btn" onClick={this.pressModeBtn.bind(this)}>Mode {this.state.mode}</button>
                    <button className="button increase-btn" onClick={this.pressIncreaseBtn.bind(this)} >Increase</button>
                    <button className="button light-btn" onClick={this.pressLightBtn.bind(this)} >Light</button>
                </div>
                
                <div className={`face-clock ${this.state.light ? "active" : ""}`}>
                    <span className="clock-text">{hours}:{minutes}<sub className="seconds">{seconds}</sub></span>
                    {config.meridiem ?
                        <sub className="meridiem">{meridiem}</sub> : null}
                </div>
                <div className="button">
                    <button className="button reset-btn" onClick={this.reset.bind(this)} >Reset</button>
                    <button className="button reset-btn" onClick={this.resetMeridiem.bind(this)} >Show meridiem </button>
                </div>
                
            </div>
        );
    }
}

Clock.propTypes = {
    /* Required */
    config: PropTypes.shape({
        id: PropTypes.string,
        mode: Number,
        light: PropTypes.bool,
        city: PropTypes.string.isRequired,
        timezone: PropTypes.string.isRequired,
        locale: PropTypes.string,
        showCity: PropTypes.bool,
        showTimezone: PropTypes.bool,
        meridiem: PropTypes.bool,
    })
};

export default Clock;