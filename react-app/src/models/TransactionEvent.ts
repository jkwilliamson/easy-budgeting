import type { FormattedTransaction } from "../models/FormattedTransaction";

class TransactionEvent {

  static compareFn(a: TransactionEvent, b: TransactionEvent) {
    const difference = a.date.getTime() - b.date.getTime();
    if (difference === 0) {
      return a.priority - b.priority;
    }
    return difference;
  }

  id:         number;
  name:       string;
  priority:   number;
  amount:     number;
  senderID:   number;
  receiverID: number;
  date:       Date;
  constructor(t: FormattedTransaction, d: Date) {
    this.id = t.id;
    this.name = t.name;
    this.priority = t.priority;
    this.amount = t.amount;
    this.senderID = t.senderID;
    this.receiverID = t.receiverID;
    this.date = d;
  }
}

export { TransactionEvent };