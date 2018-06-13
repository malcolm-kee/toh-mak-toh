import * as React from 'react';
import { addRecord } from './database';
import { vibrate } from './domService';

const DEFAULT_WORK_TIME = 50 * 60;
const DEFAULT_REST_TIME = 17 * 60;

const enum RunMode {
  Rest = 'Rest',
  Work = 'Work'
}

export const enum Screen {
  Main = 'Main',
  History = 'History'
}

export interface IAppContext {
  runMode: RunMode;
  isRunning: boolean;
  remainingSec: number;
  workTime: number;
  restTime: number;
  toggleRun: () => void;
  setWorkTime: (workTime: number) => void;
  setRestTime: (restTime: number) => void;
  screen: Screen;
  goTo: (screen: Screen) => void;
}

const DEFAULT_APP_CONTEXT: IAppContext = {
  runMode: RunMode.Work,
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
  },
  screen: Screen.Main,
  goTo: () => {
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
    vibrate();
    this.setState(prevState => {
      if (prevState.runMode === RunMode.Work) {
        return {
          runMode: RunMode.Rest,
          remainingSec: prevState.restTime,
          isRunning: false
        };
      } else {
        addRecord(this.state.workTime, this.state.restTime);
        return {
          runMode: RunMode.Work,
          remainingSec: prevState.workTime,
          isRunning: false
        };
      }
    });
  };

  goTo = (screen: Screen) => {
    this.setState({
      screen
    });
  };

  state = {
    ...DEFAULT_APP_CONTEXT,
    toggleRun: this.toggleRun,
    setWorkTime: this.setWorkTime,
    setRestTime: this.setRestTime,
    goTo: this.goTo
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
