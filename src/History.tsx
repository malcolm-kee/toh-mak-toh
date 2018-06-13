import * as React from 'react';
import { getTodayRecords, ICycleRecord, clearHistory } from './database';

const Details: React.SFC<{
  work: number;
  rest: number;
  cycle: number;
}> = props => (
  <div>
    <div className="history-details">
      You've completed {props.cycle} cycles today.
      <ul>
        <li>Work for {props.work} minutes.</li>
        <li>Rest for {props.rest} minutes.</li>
      </ul>
    </div>
  </div>
);

const NoHistory: React.SFC = () => (
  <div>
    <div className="history-details">You have not work today :(</div>
  </div>
);

interface IState {
  records: ICycleRecord[];
}

export class History extends React.Component<{}, IState> {
  state: IState = {
    records: []
  };

  render() {
    const records = this.state.records;
    return (
      <div className="history">
        <h1>History</h1>
        {records.length > 0 ? (
          <>
            <Details
              work={this.workMinutes}
              rest={this.restMinutes}
              cycle={records.length}
            />
            <button onClick={this.handleClearHistory} className="button">
              Clear History
            </button>
          </>
        ) : (
          <NoHistory />
        )}
      </div>
    );
  }

  get workMinutes() {
    return this.state.records.reduce(
      (total, record) => total + record.workSec / 60,
      0
    );
  }

  get restMinutes() {
    return this.state.records.reduce(
      (total, record) => total + record.restSec / 60,
      0
    );
  }

  handleClearHistory = () => {
    clearHistory().then(() => this.setState({ records: [] }));
  };

  componentDidMount() {
    getTodayRecords().then(records => this.setState({ records }));
  }
}
