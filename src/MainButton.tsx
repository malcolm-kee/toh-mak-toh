import * as React from 'react';
import { IAppContext, AppContextConsumer } from './AppContext';

const getMinute = (sec: number) => Math.floor(sec / 60);

const getSecond = (sec: number) => (sec % 60 < 10 ? '0' + sec % 60 : sec % 60);

class MainButtonContainer extends React.PureComponent<IAppContext> {
  render() {
    return (
      <div
        className="main-button"
        role="button"
        tabIndex={0}
        onClick={this.props.toggleRun}
      >
        <h3 className="label">Remaining</h3>
        <h2 className="time">
          <span className="minute">{getMinute(this.props.remainingSec)}</span>
          <span className="second">{getSecond(this.props.remainingSec)}</span>
        </h2>
        <div className="action">{this.action}</div>
      </div>
    );
  }

  get action() {
    const props = this.props;
    return props.isRunning
      ? 'Pause'
      : props.runMode === 'Work'
        ? props.remainingSec === props.workTime
          ? 'Work'
          : 'Resume'
        : props.remainingSec === props.restTime
          ? 'Rest'
          : 'Resume';
  }
}

export const MainButton: React.SFC = () => (
  <AppContextConsumer>
    {value => <MainButtonContainer {...value} />}
  </AppContextConsumer>
);
