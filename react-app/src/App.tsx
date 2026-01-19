import { useState } from "react";
import { Account, type Accounts } from "./models/Account";
import { Transaction, type Transactions } from "./models/Transaction";
import AccountElement from "./components/account-input/AccountElement";
import InputBox from "./components/InputBox";
import NavBar from "./components/NavBar";
import { OutputBox, type Outputs } from "./components/output/OutputBox";
import TransactionElement from "./components/transaction-input/TransactionElement";
import type { Range, RangeKeyDict } from "react-date-range";
import { addYears } from "date-fns";
import run from "./processes/run";

function App() {
  const accountsUseState = useState({
    ordering: []
  } as Accounts);
  const accounts = accountsUseState[0];

  const transactionsUseState = useState({
    ordering: []
  } as Transactions);
  const transactions = transactionsUseState[0];

  const defaultDateRange: Range = { startDate: new Date(), endDate: addYears(new Date(), 1), key: 'selection' };
  const [dateRange, setDateRange] = useState(defaultDateRange);
  const handleDateRange = (rangesByKey: RangeKeyDict) => {
    setDateRange(rangesByKey.selection);
  };

  const [outputs, setOutputs] = useState({
    ledger:     undefined,
    chartData:  undefined,
    message:    undefined
  } as Outputs);

  const handleRun = () => {
    setOutputs({ ...outputs, ...run(accounts, transactions, dateRange) })
  }

  return (
    <>
      <NavBar/>
      <div className='container row m-auto text-center'>
        <div className='row g-2'>
          <div className='col'>
            <InputBox name='Accounts' onClick={() => Account.add(accountsUseState)}>
              {accounts.ordering.map((id) => (
                <AccountElement 
                  key         = {'account' + id} 
                  account     = {accounts[id]}
                  setProperty = {(key: string, value: string) => {Account.setProperty(accountsUseState, id, key, value)}}
                  onDelete    = {() => {
                    Transaction.deleteAccountID(transactionsUseState, id);
                    Account.delete(accountsUseState, id);
                  }}
                />
              ))}
            </InputBox>
          </div>
          <div className='col'>
            <InputBox name='Transactions' onClick={() => {Transaction.add(transactionsUseState)}}>
              {transactions.ordering.map((id) => (
                <TransactionElement
                  key             = {'transaction' + id}
                  keyName         = {'transaction' + id}
                  transaction     = {transactions[id]}
                  accounts        = {accounts}
                  minRangeBounds  = {dateRange}
                  setProperty = {(key: string, value: number | string | Range) => {Transaction.setProperty(transactionsUseState, id, key, value)}}
                  onDelete    = {() => {Transaction.delete(transactionsUseState, id)}}
                />
              ))}
            </InputBox>
          </div>
        </div>
        <div className='row g-2'>
          <div className='col'>
            <div className='content-bg'>
              <OutputBox
                dateRange       = {dateRange}
                outputs         = {outputs}
                handleDateRange = {handleDateRange}
                handleRun       = {handleRun}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;