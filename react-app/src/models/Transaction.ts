import type { Range } from "react-date-range";

class Transaction {
  static #nextID = 1;
  static getNextID() {
    return Transaction.#nextID++;
  }

  static add([transactions, setTransactions]: [Transactions, React.Dispatch<React.SetStateAction<Transactions>>], id: number = Transaction.getNextID(), name?: string, priority?: string, amount?: string, senderID?: number, receiverID?: number, range?: Range, frequency?: string, frequencyType?: string) {
    setTransactions({
      ...transactions,
      [id]: new Transaction(id, name, priority, amount, senderID, receiverID, range, frequency, frequencyType),
      ordering: [...transactions.ordering, id]
    });
  }

  static delete([transactions, setTransactions]: [Transactions, React.Dispatch<React.SetStateAction<Transactions>>], id: number) {
    const { [id]: discard, ...remainingTransactions } = transactions;
    setTransactions({
      ...remainingTransactions,
      ordering: transactions.ordering.filter(thisID => thisID !== id)
    });
  }

  static deleteAccountID([transactions, setTransactions]: [Transactions, React.Dispatch<React.SetStateAction<Transactions>>], accountID: number) {
    transactions.ordering.map(transID => {
      if (transactions[transID].senderID == accountID) {
        Transaction.setProperty([transactions, setTransactions], transID, 'senderID', -1);
      }
      if (transactions[transID].receiverID == accountID) {
        Transaction.setProperty([transactions, setTransactions], transID, 'receiverID', -1);
      }
    });
  }

  static setProperty([transactions, setTransactions]: [Transactions, React.Dispatch<React.SetStateAction<Transactions>>], id: number, key: string, value: number | string | Range) {
    setTransactions({
      ...transactions,
      [id]: {
        ...transactions[id],
        [key]: value
      }
    });
  }

  static get FREQ_TYPES() {
    return [
      'days',
      'weeks',
      'months',
      'years'
    ];
  }

  id:         number;
  name:       string;
  priority:   string;
  amount:     string;
  senderID:   number;
  receiverID: number;
  range:      Range;
  freq:       string;
  freqType:   string;
  constructor(id: number, name: string = '', priority: string = '', amount: string = '', senderID: number = -1, receiverID: number = -1, range: Range = { startDate: new Date(), endDate: undefined, key: 'selection' }, freq = '', freqType = Transaction.FREQ_TYPES[0]) {
    this.id = id;
    this.name = name;
    this.priority = priority;
    this.amount = amount;
    this.senderID = senderID;
    this.receiverID = receiverID;
    this.range = range;
    this.freq = freq;
    this.freqType = freqType;
  }
}

interface Transactions {
  [id: number]: Transaction;
  ordering: number[];
}

export { Transaction };
export type { Transactions };