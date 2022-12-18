// Alert + Prompt Patch
export function alertPatch() {
  const oldAlert = alert;
  window.alert = function(data) {
    if (window.fe.isTextMode) { // No clue why the fuck this woks
      console.write('<br><b>' + data + '<b>');
    } else {
      oldAlert(data);
    }
  }; // alert but not stupid
}