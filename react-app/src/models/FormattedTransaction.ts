import type { Transaction } from "./Transaction";

interface FormattedRange {
  startDate:  Date;
  endDate?:   Date;
}

class FormattedTransaction {
  // no validation
  id:         number;
  freqType:   string;
  // need validation
  name:       string;
  priority:   number;
  amount:     number;
  senderID:   number;
  receiverID: number;
  range:      FormattedRange;
  freq?:      number;
  constructor(t: Transaction) {
    this.id         = t.id;
    this.freqType   = t.freqType;
    this.name       = t.name.trim();
    this.priority   = t.priority.trim() === '' ? 3 : Number(t.priority.trim());
    this.amount     = Number(t.amount.trim());
    this.senderID   = t.senderID;
    this.receiverID = t.receiverID;
    if (typeof(t.range.startDate) === 'undefined') {
      throw new Error('An unexpected error occurred.');
    }
    this.range      = { startDate: t.range.startDate, endDate: t.range.endDate };
    this.freq       = t.freq !== '' ? Number(t.freq.trim()) : undefined;
  }
}

interface FormattedTransactions {
  [id: number]: FormattedTransaction;
  ordering:     number[];
}

export { FormattedTransaction };
export type { FormattedRange, FormattedTransactions };