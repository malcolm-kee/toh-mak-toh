import * as React from 'react';
import { AppContextConsumer, Screen } from './AppContext';

interface IProps {
  screen: Screen;
  goTo: (screen: Screen) => void;
  show: boolean;
}

class NavButtonContainer extends React.PureComponent<IProps> {
  render() {
    return this.props.show ? (
      <button className="button" onClick={this.handleClick}>
        {this.label}
      </button>
    ) : null;
  }

  handleClick = () => {
    if (this.props.screen === Screen.Main) this.props.goTo(Screen.History);
    else this.props.goTo(Screen.Main);
  };

  get label() {
    return this.props.screen === Screen.Main ? 'Statistics' : 'Go Back';
  }
}

export const NavButton: React.SFC = () => (
  <AppContextConsumer>
    {value => (
      <NavButtonContainer
        screen={value.screen}
        goTo={value.goTo}
        show={!value.isRunning}
      />
    )}
  </AppContextConsumer>
);
