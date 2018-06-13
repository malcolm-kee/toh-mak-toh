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
            onClick={this.handleShowForm}
          >
            Setting
          </button>
        )}
        {this.state.showSetting && (
          <SettingForm hideForm={this.handleHideForm} />
        )}
      </div>
    );
  }

  handleShowForm = () => {
    this.setState({
      showSetting: true
    });
  };

  handleHideForm = () =>
    this.setState({
      showSetting: false
    });
}

export const SettingButton: React.SFC = () => (
  <AppContextConsumer>
    {value => <SettingButtonContainer {...value} />}
  </AppContextConsumer>
);
