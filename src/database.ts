import { get, set, del } from 'idb-keyval';

export interface ICycleRecord {
  workSec: number;
  restSec: number;
  date: Date;
}

export interface ISetting {
  workSec: number;
  restSec: number;
}

const HISTORY_KEY = 'TOH_MAK_TOH_HISTORIES';
const SETTING_KEY = 'TOH_MAK_TOH_SETTING';

const getHistory = () => {
  return get<ICycleRecord[]>(HISTORY_KEY);
};

const setHistory = (value: ICycleRecord[]) => {
  return set(HISTORY_KEY, value);
};

const isToday = (date: Date) => {
  const today = new Date();
  return today.toDateString() === date.toDateString();
};

export const clearHistory = () => del(HISTORY_KEY);

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

export const clearSetting = () => del(SETTING_KEY);

export const getSetting = () => get<ISetting>(SETTING_KEY);

export const setSetting = (setting: ISetting) => set(SETTING_KEY, setting);
