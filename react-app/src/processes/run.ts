import { type Accounts } from "../models/Account";
import type { FormattedAccounts } from "../models/FormattedAccount";
import type { FormattedTransactions } from "../models/FormattedTransaction";
import { TransactionEvent } from "../models/TransactionEvent";
import type { Transactions } from "../models/Transaction";
import type { Range } from "react-date-range";
import formatAccounts from "./formatAccounts";
import formatTransactions from "./formatTransactions";
import { addDays, addMonths, addWeeks, addYears } from "date-fns";
import formatDate from "./formatDate";
import getMonthFrom from "./getMonthFrom";
import type { Outputs } from "../components/output/OutputBox";
import type { SimpleDataset } from "../components/output/GraphElement";

function run(accounts: Accounts, transactions: Transactions, range: Range) {
  
  // validation
  if (accounts.ordering.length === 0 && transactions.ordering.length === 0) {
    return { ledger: undefined, chartData: undefined, message: undefined };
  }

  if (accounts.ordering.length === 0) { // transactions but no accounts
    return { ledger: undefined, chartData: undefined, message: 'No accounts to monitor!' };
  }

  let fAccounts: FormattedAccounts;
  try {
    fAccounts = formatAccounts(accounts);
  } catch (e) {
    if (e instanceof Error) {
      return { ledger: undefined, chartData: undefined, message: 'ERROR: ' + e.message };
    }
    throw e;
  }

  let formattedTransactions: FormattedTransactions;
  try {
    formattedTransactions = formatTransactions(transactions, accounts);
  } catch (e) {
    if (e instanceof Error) {
      return { ledger: undefined, chartData: undefined, message: 'ERROR: ' + e.message };
    }
    throw e;
  }

  if (typeof(range.startDate) === 'undefined') {
    return { ledger: undefined, chartData: undefined, message: ('ERROR: There must be a start date for the simulation!') };
  }
  range.startDate.setHours(0,0,0,0);

  if (typeof(range.endDate) === 'undefined' || range.endDate.getTime() === range.startDate.getTime()) {
    range.endDate = addYears(range.startDate, 1);
  }

  // preparation
  const addToDate = (date: Date, amount: number, freqType: string) => {
    switch (freqType) {
      case 'days':
        return addDays(date, amount);
      case 'weeks':
        return addWeeks(date, amount);
      case 'months':
        return addMonths(date, amount);
      case 'years':
        return addYears(date, amount);
      default:
        throw new Error(`An unexpected error occurred in event preparation.`);
    }
  }

  // create events and sort by date
  const events = [] as TransactionEvent[];
  for (const id of formattedTransactions.ordering) {
    let currDate = formattedTransactions[id].range.startDate;
    currDate.setHours(0,0,0,0);
    while (currDate.getTime() <= range.endDate.getTime()) {
      if (currDate.getTime() >= range.startDate.getTime()) {
        events.push(new TransactionEvent(formattedTransactions[id], currDate));
      }
      if (typeof(formattedTransactions[id].freq) === 'undefined') {
        break;
      }
      currDate = addToDate(currDate, formattedTransactions[id].freq, formattedTransactions[id].freqType);
    }
  }
  events.sort(TransactionEvent.compareFn);

  // simulation (apy has to be calculated based on daily balances)
  let ledger = '';
  const chartData = {
    labels: [] as any[],
    datasets: [] as SimpleDataset[]
  };

  const addEventToLedger = (name: string, sID: number, rID: number, amount: number, date: Date) => {
    if (sID === rID) {
      throw new Error('Sender cannot equal receiver!');
    }

    let line = `[${formatDate(date, true)}] ${name} `;

    if (sID === 0) {
      line += `(external → ${fAccounts[rID].name})\n`;
    } else if (rID === 0) {
      line += `(${fAccounts[sID].name} → external)\n`;
    } else {
      line += `(${fAccounts[sID].name} → ${fAccounts[rID].name})\n`;
    }

    if (sID !== 0) {
      line += `[  >  >  ] ${fAccounts[sID].name}: $${fAccounts[sID].balance.toFixed(2)} (-$${amount.toFixed(2)})\n`;
    } 
    if (rID !== 0) {
      line += `[  >  >  ] ${fAccounts[rID].name}: $${fAccounts[rID].balance.toFixed(2)} (+$${amount.toFixed(2)})\n`;
    }

    ledger += line;
  }

  const logEventExplicit = (name: string, sID: number, rID: number, amount: number, date: Date) => {
    if (sID === rID) {
      throw new Error('Sender cannot equal receiver!');
    }

    if (sID !== 0) {
      fAccounts[sID].balance -= amount;
    }
    if (rID !== 0) {
      fAccounts[rID].balance += amount;
    }

    addEventToLedger(name, sID, rID, amount, date);
  }

  const logEvent = (e: TransactionEvent, d: Date) => {
    logEventExplicit(e.name, e.senderID, e.receiverID, e.amount, d);
  }

  let currDate = range.startDate;
  while (currDate.getTime() <= range.endDate.getTime()) {

    if (currDate.getDate() === 1 || currDate.getTime() === range.startDate.getTime()) {
      // print month only if an event occurs within it (including interest payouts)
      const nextEventInThisMonth = events.length > 0 && events[0].date.getMonth() === currDate.getMonth();
      let interestPayoutThisMonth = false;
      for (const id of fAccounts.ordering) {
        const a = fAccounts[id];
        if (typeof(a.unpostedInterest) !== 'undefined' && a.unpostedInterest > 0) {
          interestPayoutThisMonth = true;
          break;
        }
      }
      
      if (nextEventInThisMonth || interestPayoutThisMonth) {
        if (ledger.length !== 0) ledger += '\n';
        ledger += `< ${getMonthFrom(currDate, true).toUpperCase()} ${currDate.getFullYear()} >\n`;
      }
    }

    if (currDate.getDate() === 1) {
      // payout interest monthly
      for (const id of fAccounts.ordering) {
        const a = fAccounts[id];
        if (typeof(a.unpostedInterest) !== 'undefined' && a.unpostedInterest > 0) {
          logEventExplicit(`Interest Payout`, 0, id, a.unpostedInterest, currDate);
          a.unpostedInterest = 0;
        }
      }
    }
    chartData.labels.push(formatDate(currDate));

    while (events[0] && events[0].date.getTime() === currDate.getTime()) {
      logEvent(events[0], currDate);
      events.shift();
    }

    // compound interest daily
    for (const id of fAccounts.ordering) {
      const a = fAccounts[id];
      if (typeof(a.dpr) !== 'undefined' && typeof(a.unpostedInterest) !== 'undefined' && a.balance > 0) {
        a.unpostedInterest += (a.balance + a.unpostedInterest) * a.dpr;
      }
      a.balanceHistory.push(a.balance);
    }

    currDate = addDays(currDate, 1);
  }

  chartData.datasets = fAccounts.ordering.map((accID) => {
    const acc = fAccounts[accID];
    return {
      label:  acc.name,
      data:   acc.balanceHistory,
      color:  acc.color
    }
  }) as SimpleDataset[];

  return { 
    ledger:     ledger, 
    chartData:  chartData,
    message:    undefined
  } as Outputs;
}

export default run;