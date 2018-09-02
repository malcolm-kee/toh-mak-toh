import * as React from 'react';
import ReactNoSleep, { NoSleepProps } from 'react-no-sleep';
import { addRecord, getSetting, setSetting, ISetting } from './database';
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
  setSetting: (setting: ISetting) => void;
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
  setSetting: () => {
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

class AppContextProviderContainer extends React.Component<
  NoSleepProps,
  IAppContext
> {
  private timer: number;

  toggleRun = () => {
    this.setState(
      prevState => ({
        isRunning: !prevState.isRunning
      }),
      () => {
        if (this.state.isRunning) {
          this.props.enable();
        } else {
          this.props.disable();
        }
      }
    );
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

  setSetting = (setting: ISetting) => {
    this.setState(
      prevState => {
        if (prevState.runMode === RunMode.Work) {
          return {
            remainingSec: setting.workSec,
            workTime: setting.workSec,
            restTime: setting.restSec
          };
        } else {
          return {
            remainingSec: setting.restSec,
            workTime: setting.workSec,
            restTime: setting.restSec
          };
        }
      },
      () => {
        setSetting(setting);
      }
    );
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
    setSetting: this.setSetting,
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

  componentDidMount() {
    getSetting().then(setting => {
      if (setting !== undefined) {
        this.setState({
          remainingSec: setting.workSec,
          workTime: setting.workSec,
          restTime: setting.restSec
        });
      }
    });
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export const AppContextProvider: React.SFC = props => (
  <ReactNoSleep>
    {noSleepProps => (
      <AppContextProviderContainer {...noSleepProps} {...props} />
    )}
  </ReactNoSleep>
);

export const AppContextConsumer = AppContext.Consumer;
