import React, { Component } from 'react';
import { PropTypes } from 'prop-types'; 
import moment from 'moment-timezone';
import './clock-locales';
import '../styles/App.css';

/**
 * Clock Class
 * id
 * city
 * timezone
 * hours
 * minutes
 * seconds
 * light: light mode is on or off at night
 * editableMode: 0 is not editable, 1 is hour editable, 2 is minute editable
 * displayMode: time is displayed in 24h or AM/PM format
 */

class Clock extends Component { 
    constructor(props) {
        super(props);
        /* Set Default Props Values */
        if (this.props.config.id === undefined) { this.props.config.id = `clock-${this.props.config.city}` }
        if (this.props.config.locale === undefined) { this.props.config.locale = 'en' }
        /*Use 12 hour clock to show AM/PM, default is false */
        if (this.props.config.meridiem === undefined) { this.props.config.meridiem = false }
    
        /* Set Initlal State */
        const {hours, minutes, seconds} = this.getCurrentTime(this.props.config.timezone, this.props.config.locale);

        this.state = {
          hours: hours,
          minutes: minutes,
          seconds: seconds,
          editableMode: 0,
          light: false,
          displayMode: false,
          meridiem: '',
        };
    }

    updateClock() {
        let newHours = this.state.hours;
        let newMinutes =this.state.minutes;
        let newSeconds = this.state.seconds + 1;
        let newMerdiem = this.state.meridiem;

        if(newSeconds === 60) {
            newMinutes++;
            newSeconds = 0;
            if(newMinutes === 60){
                newHours++;
                newMinutes = 0;
                if(newHours === 24) {
                    newHours = 0;
                }
                
                if(this.state.displayMode){
                    newMerdiem = (newHours < 12) ? 'AM' : 'PM';
                }
            }
        }
        
        this.setState({
            hours: newHours,
            minutes: newMinutes,
            seconds: newSeconds,
            merdiem: newMerdiem,
        });
    }

    componentDidMount() {
        const clockThread = setInterval(() => {
            this.updateClock();
        }, 1000);
    
        this.setState({ clockThread });
    }

    componentWillUnmount() {
        clearInterval(this.state.clockThread);
    }

    getCurrentTime(timezone, locale) {
        moment.locale(locale);
        const now = moment().tz(timezone);
        const tz = moment().tz(timezone).format('z');
    
        // Time 
        let hours = now.get('hour');
        const minutes = now.get('minute');
        const seconds = now.get('second');
    
        // return time object
        return {
          hours: hours,
          minutes: minutes,
          seconds: seconds,
          timezone: tz
        };
    }

    /**
     * State Mode value default is 0, 1 is hour editable, 2 is minute editable
     */
    pressModeBtn() {
        let newMode = (this.state.editableMode + 1)%3;
        this.setState({
            editableMode: newMode
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
        let newHours = this.state.hours;
        let newMinutes = this.state.minutes;
        switch(this.state.editableMode){
            case 1:
                newHours++;
                if(newHours === 24){
                    newHours = 0;
                }
                break;
            case 2:
                newMinutes++;
                if(newMinutes === 60) {
                    newMinutes = 0;
                }
                break;
            default:
                break;
        }

        this.setState({
            hours: newHours,
            minutes: newMinutes,
        });
    }

    reset() {
        const {
            hours,
            minutes,
            seconds,
            } = this.getCurrentTime(this.props.config.timezone, this.props.config.locale);
        this.setState({
            hours: hours,
            minutes: minutes,
            seconds: seconds,
        });
    }

    changeDisplayMode() {
        const newMeridiem = (this.state.hours < 12) ? 'AM' : 'PM';
        const newDisplayMode = !this.state.displayMode;

        this.setState({
            displayMode: newDisplayMode,
            meridiem: newMeridiem,
        });
    }

    displayTime() {
        let displayHours = this.state.displayMode? this.state.hours%12: this.state.hours ;
        if(displayHours === 0 && this.state.displayMode){
            displayHours = 12;
        }
        return ({
            hoursMinutes: (displayHours < 10 ? '0' : '') + displayHours + ":" + (this.state.minutes < 10 ? '0' : '') + this.state.minutes,
            seconds: (this.state.seconds < 10 ? '0' : '') + this.state.seconds});
    }

    render() {
        const { config } = this.props;
        const {hoursMinutes, seconds }= this.displayTime();
        return (
            <div id={this.state.id} className="clock">
                <h1 className="city">{config.city}</h1>
                <h2 className="timezone">{config.timezone}{this.state.timezone}</h2>
                <div className="button">
                    <button className="button mode-btn" onClick={this.pressModeBtn.bind(this)}>Mode {this.state.editableMode}</button>
                    <button className="button increase-btn" onClick={this.pressIncreaseBtn.bind(this)} >Increase</button>
                    <button className="button light-btn" onClick={this.pressLightBtn.bind(this)} >Light</button>
                </div>
                
                <div className={`face-clock ${this.state.light ? "active" : ""}`}>
                    <span className="clock-text">{hoursMinutes}<sub className="seconds">{seconds}</sub></span>
                    {this.state.displayMode ?
                        <sub className="meridiem">{this.state.meridiem}</sub> : null}
                </div>
                <div className="button">
                    <button className="button reset-btn" onClick={this.reset.bind(this)} >Reset</button>
                    <button className="button reset-btn" onClick={this.changeDisplayMode.bind(this)} >Show meridiem </button>
                </div>
                
            </div>
        );
    }
}

Clock.propTypes = {
    /* Required */
    config: PropTypes.shape({
        id: PropTypes.string,
        hours: Number,
        minutes: Number,
        seconds: Number,
        timezone: PropTypes.string.isRequired,
        editableMode: Number,
        displayMode: PropTypes.bool,
        light: PropTypes.bool,
        city: PropTypes.string,
        locale: PropTypes.string,
        meridiem: PropTypes.string,
    })
};

export default Clock;