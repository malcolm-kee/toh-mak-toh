export const vibrate = () => {
  if (window.navigator.vibrate) {
    window.navigator.vibrate([200, 300, 200]);
  }
};
