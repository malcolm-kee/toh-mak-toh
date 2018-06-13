import * as React from 'react';
import { IAppContext, AppContextConsumer } from './AppContext';
import { SettingForm } from './SettingForm';

interface IState {
  showSetting: boolean;
}

class SettingButtonContainer extends React.PureComponent<IAppContext, IState> {
  state = {
    showSetting: false
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
          <SettingForm toggleShow={this.handleToggleShow} />
        )}
      </div>
    );
  }

  handleToggleShow = () => {
    this.setState(prevState => ({
      showSetting: !prevState.showSetting
    }));
  };
}

export const SettingButton: React.SFC = () => (
  <AppContextConsumer>
    {value => <SettingButtonContainer {...value} />}
  </AppContextConsumer>
);
