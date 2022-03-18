import React, { Component } from "react";
import Clock from './clock';
import '../styles/App.css';
import momentTZ from 'moment-timezone';

const _clocks = [
  { id: 'clockEroupe_Paris', city: 'Paris', timezone: 'Europe/Paris', mode: 0,  light: false},
  { id: 'clockAmerica_New_York', city: 'New York', timezone: 'America/New_York', mode: 0,  light: false },
  { id: 'clockAsia_BangKok', city: 'Ho Chi Minh', timezone: 'Asia/Bangkok', mode: 0,  light: false },
  { id: 'clockAsia_Qatar', city: 'Qatar', timezone: 'Asia/Qatar', mode: 0,  light: false },
  { id: 'clockHongkong', city: 'Hongkong', timezone: 'Hongkong', mode: 0,  light: false },
];

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      clocks: _clocks,
      timezones: momentTZ.tz.names(),
      newClockTimeZone: momentTZ.tz.names()[0],
    };
    this.onselect = this.onselect.bind(this);
    this.addNewClock = this.addNewClock.bind(this);
  }

  componentDidMount() {
    this.state = {
      clocks: _clocks,
      timezones: momentTZ.tz.names(),
    };
  }

  addNewClock(e){
    e.preventDefault();
    let newClock =  { id: 'clock'+ this.state.newClockTimeZone?.split("/")[0] + '_' + this.state.newClockTimeZone?.split("/")[1], 
    city: this.state.newClockTimeZone?.split("/")[1], 
    timezone: this.state?.newClockTimeZone, 
    mode: 0,  
    light: false};

    let newClocks = this.state.clocks;
    newClocks.push(newClock);
    this.setState({clocks: newClocks});
  }

  onselect(event) {
    console.log(event.target.value);
    this.setState({ newClockTimeZone: event.target.value });
    console.log(this.state.newClockTimeZone);
  }

  render() {
    return (
      <>
        <div className="title">
          <h1>Digital Watch</h1>
          <span><i><b>Note: </b>Watch editable mode: 0 do nothing, 1 edit hours, 2 edit minutes</i></span>
        </div>
        <div className="container">
          {this.state.clocks.map(clock =>
            <Clock key={clock.id} config={clock} />
          )}
          <div className="clock add">
            <h1 className="city">Add a new clock</h1>
            <div className="face-clock">
              <form onSubmit={this.addNewClock}>
                <label>
                  Time zone:
                  <div className="select-container">
                    <select className="select" value={this.state.newClockTimeZone} onChange={this.onselect}>
                      {this.state.timezones.map((tz, i) => (
                        <option key={i} value={tz}>{tz}</option>
                      ))}
                    </select>
                  </div>
                </label>
                <input className="button light-btn" type="submit" value="Add clock" />
              </form>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;