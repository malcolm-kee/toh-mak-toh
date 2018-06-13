import { get, set, del } from 'idb-keyval';

export interface ICycleRecord {
  workSec: number;
  restSec: number;
  date: Date;
}

const KEY = 'TOH_MAK_TOH_HISTORIES';

const getHistory = () => {
  return get<ICycleRecord[]>(KEY);
};

const setHistory = (value: ICycleRecord[]) => {
  return set(KEY, value);
};

const isToday = (date: Date) => {
  const today = new Date();
  return today.toDateString() === date.toDateString();
};

export const clearHistory = () => del(KEY);

export const getTodayRecords = () =>
  getHistory().then((histories = []) =>
    Promise.resolve(histories.filter(record => isToday(record.date)))
  );

export const addRecord = (workSec: number, restSec: number) =>
  getHistory().then((histories = []) =>
    Promise.resolve(
      setHistory(histories.concat({ workSec, restSec, date: new Date() }))
    )
  );
