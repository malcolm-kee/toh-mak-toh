import * as React from 'react';
import { AppContextConsumer, IAppContext } from './AppContext';

const MainBodyContent: React.SFC<{ stateClass: string }> = props => (
  <main className={props.stateClass}>{props.children}</main>
);

const deriveStateClass = (value: IAppContext): string => {
  const classes = ['App-body'];
  if (value.isRunning) classes.push('running');
  if (value.runMode === 'Rest') classes.push('rest');

  return classes.join(' ');
};

export const MainBody: React.SFC = props => (
  <AppContextConsumer>
    {value => (
      <MainBodyContent {...props} stateClass={deriveStateClass(value)} />
    )}
  </AppContextConsumer>
);
