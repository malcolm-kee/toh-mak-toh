import * as React from 'react';

const DEFAULT_WORK_TIME = 50 * 60;
const DEFAULT_REST_TIME = 17 * 60;

export interface IAppContext {
  runMode: 'Rest' | 'Work';
  isRunning: boolean;
  remainingSec: number;
  workTime: number;
  restTime: number;
  toggleRun: () => void;
  setWorkTime: (workTime: number) => void;
  setRestTime: (restTime: number) => void;
}

const DEFAULT_APP_CONTEXT: IAppContext = {
  runMode: 'Work',
  isRunning: false,
  remainingSec: DEFAULT_WORK_TIME,
  workTime: DEFAULT_WORK_TIME,
  restTime: DEFAULT_REST_TIME,
  toggleRun: () => {
    /* noop */
  },
  setWorkTime: () => {
    /* noop */
  },
  setRestTime: () => {
    /* noop */
  }
};

const AppContext = React.createContext<IAppContext>({
  ...DEFAULT_APP_CONTEXT
});

export class AppContextProvider extends React.Component<{}, IAppContext> {
  private timer: number;

  toggleRun = () => {
    this.setState(prevState => ({
      isRunning: !prevState.isRunning
    }));
  };

  setWorkTime = (workTime: number) => {
    this.setState(prevState => ({
      remainingSec:
        prevState.runMode === 'Work' ? workTime : prevState.remainingSec,
      workTime
    }));
  };

  setRestTime = (restTime: number) => {
    this.setState(prevState => ({
      remainingSec:
        prevState.runMode === 'Rest' ? restTime : prevState.remainingSec,
      restTime
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
        prevState.runMode === 'Work'
          ? {
              runMode: 'Rest',
              remainingSec: prevState.restTime,
              isRunning: false
            }
          : {
              runMode: 'Work',
              remainingSec: prevState.workTime,
              isRunning: false
            }
    );
  };

  state = {
    ...DEFAULT_APP_CONTEXT,
    toggleRun: this.toggleRun,
    setWorkTime: this.setWorkTime,
    setRestTime: this.setRestTime
  };

  componentDidUpdate(prevProps: {}, prevState: IAppContext) {
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

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export const AppContextConsumer = AppContext.Consumer;
