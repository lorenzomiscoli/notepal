export var isDateGreaterThanToday = (dateString: string) => {
  const scheduled = new Date(dateString);
  const today = new Date();
  scheduled.setSeconds(0, 0);
  today.setSeconds(0, 0);
  return scheduled.toISOString() > today.toISOString();
};

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
