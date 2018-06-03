import * as React from 'react';
import { IAppContext, AppContextConsumer } from './AppContext';

const isNumber = (value: string | number): boolean =>
  value !== null &&
  value !== undefined &&
  value !== '' &&
  !isNaN(Number(value));

interface IState {
  showSetting: boolean;
  workTime: number | string;
  restTime: number | string;
}

class SettingButtonContainer extends React.PureComponent<IAppContext, IState> {
  state = {
    showSetting: false,
    workTime: this.props.workTime / 60,
    restTime: this.props.restTime / 60
  };

  render() {
    if (this.props.isRunning) return null;

    return (
      <div className="setting-button-container">
        {!this.props.isRunning && (
          <button
            type="button"
            className="button setting-button"
            onClick={this.handleToggleShow}
          >
            Setting
          </button>
        )}
        {this.state.showSetting && (
          <div className="setting-form">
            <div className="field">
              <label htmlFor="workTime">Work Time (Minute)</label>
              <input
                name="workTime"
                id="workTime"
                type="number"
                value={this.state.workTime}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="restTime">Rest Time (Minute)</label>
              <input
                name="restTime"
                id="restTime"
                type="number"
                value={this.state.restTime}
                onChange={this.handleInputChange}
              />
            </div>
            <div className="button-group">
              <button
                onClick={this.handleSaveSetting}
                type="button"
                className="button"
                disabled={this.isInvalid()}
              >
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  isInvalid = () => {
    return !isNumber(this.state.restTime) || !isNumber(this.state.workTime);
  };

  handleInputChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const name = e.target.name as keyof IState;
    const value = e.target.value;
    this.setState(
      prevState =>
        ({
          [name]: value
        } as Pick<IState, 'workTime' | 'restTime'>)
    );
  };

  handleToggleShow = () => {
    this.setState(prevState => ({
      showSetting: !prevState.showSetting
    }));
  };

  handleSaveSetting = () => {
    if (isNumber(this.state.restTime) && isNumber(this.state.workTime)) {
      this.props.setRestTime(this.state.restTime * 60);
      this.props.setWorkTime(this.state.workTime * 60);
      this.handleToggleShow();
    }
  };
}

export const SettingButton: React.SFC = () => (
  <AppContextConsumer>
    {value => <SettingButtonContainer {...value} />}
  </AppContextConsumer>
);
