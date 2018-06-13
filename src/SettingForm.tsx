import * as React from 'react';
import { IAppContext, AppContextConsumer } from './AppContext';

const isNumber = (value: string | number): boolean =>
  value !== null &&
  value !== undefined &&
  value !== '' &&
  !isNaN(Number(value));

interface IParentProps {
  toggleShow: () => void;
}

interface IState {
  workTime: number | string;
  restTime: number | string;
}

class SettingFormContainer extends React.PureComponent<
  IAppContext & IParentProps,
  IState
> {
  rootRef: React.RefObject<HTMLDivElement> = React.createRef();

  state = {
    workTime: this.props.workTime / 60,
    restTime: this.props.restTime / 60
  };

  render() {
    return (
      <div className="setting-form" ref={this.rootRef}>
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

  handleSaveSetting = () => {
    if (isNumber(this.state.restTime) && isNumber(this.state.workTime)) {
      this.props.setRestTime(this.state.restTime * 60);
      this.props.setWorkTime(this.state.workTime * 60);
      this.props.toggleShow();
    }
  };

  handleClickOutside = (e: MouseEvent) => {
    if (
      this.rootRef.current !== null &&
      e.target !== null &&
      !this.rootRef.current.contains(e.target as Element)
    ) {
      this.props.toggleShow();
    }
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
}

export const SettingForm: React.SFC<IParentProps> = props => (
  <AppContextConsumer>
    {value => <SettingFormContainer {...value} {...props} />}
  </AppContextConsumer>
);
