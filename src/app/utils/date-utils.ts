export var datetimeToDateString = (datetime: string) => {
  return datetime.split("T", 1)[0];
}

export var dateToIsoString = (date: Date) => {
  var tzo = -date.getTimezoneOffset();
  var dif = tzo >= 0 ? '+' : '-';
  var pad = function (num: any) {
    return (num < 10 ? '0' : '') + num;
  };
  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    dif + pad(Math.floor(Math.abs(tzo) / 60)) +
    ':' + pad(Math.abs(tzo) % 60);
}
