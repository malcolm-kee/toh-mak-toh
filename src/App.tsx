import * as React from 'react';
import './App.css';
import { AppContextProvider } from './AppContext';
import { MainButton } from './MainButton';
import { MainBody } from './MainBody';
import { SettingButton } from './SettingButton';

class App extends React.Component {
  render() {
    return (
      <AppContextProvider>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">TohMakToh</h1>
            <SettingButton />
          </header>
          <MainBody>
            <MainButton />
          </MainBody>
        </div>
      </AppContextProvider>
    );
  }
}

export default App;
