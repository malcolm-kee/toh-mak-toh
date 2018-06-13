import * as React from 'react';
import { AppContextConsumer, Screen } from './AppContext';
import { Main } from './Main';
import { History } from './History';

class RootRouterContainer extends React.PureComponent<{ screen: Screen }> {
  render() {
    return (
      <>
        {this.props.screen === Screen.Main && <Main />}
        {this.props.screen === Screen.History && <History />}
      </>
    );
  }
}

export const RootRouter: React.SFC = () => (
  <AppContextConsumer>
    {value => <RootRouterContainer screen={value.screen} />}
  </AppContextConsumer>
);
