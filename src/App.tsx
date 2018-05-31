import * as React from "react";
import "./App.css";

const WORK_TIME = 50 * 60;
const REST_TIME = 17 * 60;

const getMinute = (sec: number) => Math.floor(sec / 60);

const getSecond = (sec: number) => (sec % 60 < 10 ? "0" + sec % 60 : sec % 60);

interface IState {
  runMode: "Rest" | "Work";
  isRunning: boolean;
  remainingSec: number;
}

class App extends React.Component<{}, IState> {
  private timer: number;

  state: IState = {
    runMode: "Work",
    isRunning: false,
    remainingSec: WORK_TIME
  };

  render() {
    return (
      <div className={this.className}>
        <header className="App-header">
          <h1 className="App-title">TohMakToh</h1>
        </header>
        <main className="App-body">
          <div
            className="main-button"
            role="button"
            tabIndex={0}
            onClick={this.toggleRun}
          >
            <h3 className="label">Remaining</h3>
            <h2 className="time">
              <span className="minute">
                {getMinute(this.state.remainingSec)}
              </span>
              <span className="second">
                {getSecond(this.state.remainingSec)}
              </span>
            </h2>
            <div className="action">{this.action}</div>
          </div>
        </main>
      </div>
    );
  }

  get className(): string {
    const state = this.state;
    const classes = ["App"];
    if (state.isRunning) classes.push("running");
    if (state.runMode === "Rest") classes.push("rest");

    return classes.join(" ");
  }

  get action() {
    const state = this.state;
    return state.isRunning
      ? "Pause"
      : state.runMode === "Work"
        ? state.remainingSec === WORK_TIME
          ? "Work"
          : "Resume"
        : state.remainingSec === REST_TIME
          ? "Rest"
          : "Resume";
  }

  toggleRun = () => {
    this.setState(prevState => ({
      isRunning: !prevState.isRunning
    }));
  };

  tick = () => {
    this.setState(prevState => ({
      remainingSec: prevState.remainingSec - 1
    }));
  };

  switchMode = () => {
    this.setState(
      prevState =>
        prevState.runMode === "Work"
          ? {
              runMode: "Rest",
              remainingSec: REST_TIME,
              isRunning: false
            }
          : {
              runMode: "Work",
              remainingSec: WORK_TIME,
              isRunning: false
            }
    );
  };

  componentDidUpdate(prevProps: {}, prevState: IState) {
    if (this.state.isRunning && this.state.remainingSec === 0) {
      clearInterval(this.timer);
      this.switchMode();
    } else if (this.state.isRunning && !prevState.isRunning) {
      this.timer = window.setInterval(() => {
        this.tick();
      }, 1000);
    } else if (!this.state.isRunning && prevState.isRunning) {
      clearInterval(this.timer);
    }
  }
}

export default App;
