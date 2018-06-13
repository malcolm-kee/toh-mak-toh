import * as React from 'react';
import './App.css';
import { AppContextProvider } from './AppContext';
import { SettingButton } from './SettingButton';
import { NavButton } from './NavButton';
import { RootRouter } from './RootRouter';

class App extends React.Component {
  render() {
    return (
      <AppContextProvider>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">TohMakToh</h1>
            <NavButton />
            <SettingButton />
          </header>
          <RootRouter />
        </div>
      </AppContextProvider>
    );
  }
}

export default App;
