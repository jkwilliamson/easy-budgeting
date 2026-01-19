class Account {
  static #nextID = 1;
  static getNextID() {
    return Account.#nextID++;
  }

  static add([accounts, setAccounts]: [Accounts, React.Dispatch<React.SetStateAction<Accounts>>], id = Account.getNextID(), name?: string, balance?: string, apy?: string, color?: string) {
    setAccounts({
      ...accounts,
      [id]: new Account(id, name, balance, apy, color),
      ordering: [...accounts.ordering, id]
    });
  }

  static delete([accounts, setAccounts]: [Accounts, React.Dispatch<React.SetStateAction<Accounts>>], id: number) {
    const { [id]: discard, ...remainingAccounts } = accounts;
    setAccounts({
      ...remainingAccounts,
      ordering: accounts.ordering.filter(thisID => thisID !== id)
    });
  }

  static setProperty([accounts, setAccounts]: [Accounts, React.Dispatch<React.SetStateAction<Accounts>>], id: number, key: string, value: string) {
    setAccounts({
      ...accounts,
      [id]: {
        ...accounts[id],
        [key]: value
      }
    });
  }

  id:       number;
  name:     string;
  balance:  string;
  apy:      string;
  color:    string;
  constructor(id: number, name: string = '', balance: string = '', apy: string = '', color: string = '#6C757D') {
    this.id = id;
    this.name = name;
    this.balance = balance;
    this.apy = apy;
    this.color = color;
  }
}

interface Accounts {
  [id: number]: Account;
  ordering: number[];
}

export { Account };
export type { Accounts };
