import type { Account } from "./Account";

class FormattedAccount {
  // no validation
  id:                 number;
  color:              string;
  unpostedInterest?:  number;
  dpr?:               number;
  // need validation
  name:               string;
  balance:            number;
  apy?:               number;
  balanceHistory:     number[];
  constructor(a: Account) {
    this.id       = a.id;
    this.color    = a.color.trim();
    this.name     = a.name.trim();
    this.balance  = Number(a.balance.trim());
    this.apy      = a.apy.trim() === '' ? undefined : Number(a.apy.trim());
    if (typeof(this.apy) !== 'undefined') {
      const n = 365;
      const apy = Number(a.apy.trim()) / 100;
      this.dpr = Math.pow((apy + 1), (1 / n)) - 1;
      this.unpostedInterest = 0;
    }
    this.balanceHistory = [];
  }
}

interface FormattedAccounts {
  [id: number]: FormattedAccount;
  ordering:     number[];
}

export { FormattedAccount };
export type { FormattedAccounts };