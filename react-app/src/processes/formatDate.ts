function formatDate(d : Date, padding: boolean = false) {
  if (padding) {
    return `${leadingZero(d.getMonth() + 1, 2)}/${leadingZero(d.getDate(), 2)}/${leadingZero(d.getFullYear() % 100, 0)}`;
  }
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear() % 100}`;
}

function leadingZero(val: number, length: number) {
  let rtn = val.toString();
  for (let i = rtn.length; i < length; i++) {
    rtn = '0' + rtn;
  }
  return rtn;
}

export default formatDate;