// const date = new Date();
// const dayIndex = date.getDay();
// const days = ["Montag", "Dienstag", "Mittwoch", "donnerstag", "Freitag", "Samstag", "Sonntag"];

module.exports.getNowDate = ()=> {
  const event = new Date();
  const options = {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
  };

  return event.toLocaleDateString('de-DE', options);
}
