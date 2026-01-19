import { useState } from "react";
import DateRangeButton from "../transaction-input/DateRangeButton";
import type { Range, RangeKeyDict } from "react-date-range";
import { addYears } from "date-fns";
import { GraphElement, type SimpleDataset } from "./GraphElement";

interface Outputs {
  ledger?:    string;
  chartData?: {
    labels:   string[];
    datasets: SimpleDataset[];
  }
  message?:   string;
}

interface Props {
  outputs: Outputs;
  dateRange: Range;
  handleDateRange: (rangesByKey: RangeKeyDict) => void;
  handleRun: () => void;
}

function OutputBox({ outputs, dateRange, handleDateRange, handleRun }: Props) {

  const [typeSelection, setTypeSelection] = useState('Graph' as 'Console' | 'Graph');
  const toggleType = () => {
    setTypeSelection((typeSelection === 'Console') ? 'Graph' : 'Console');
  }

  const getOutput = () => {
    if ((typeof(outputs.ledger) === 'undefined' || typeof(outputs.chartData) === 'undefined')) {
      return outputs.message || 'No output to display.';
    }

    if (typeSelection === 'Console') {
      return outputs.ledger === '' ? 'No console output to display.' : outputs.ledger;
    }

    // typeSelection === 'Graph'
    return (
      <GraphElement 
        title=''
        labels={outputs.chartData.labels} 
        datasets={outputs.chartData.datasets}
      />
    );
  }

  return (
    <div className='list-group'>
      <div className='list-group-item content-bg'>
        <span className='border-0 fs-3'>{typeSelection}</span>
        <button className='btn btn-outline-secondary border-0 fs-4 ms-1 pt-0 pb-1 px-1 align-baseline' onClick={() => {toggleType()}}>⇄</button>
        <button className='btn btn-outline-secondary border-0 fs-4 ms-1 pt-0 pb-1 px-1 align-baseline' onClick={() => {handleRun()}}>Run</button>
        <div className='input-group mt-1'>
          <DateRangeButton 
            range={dateRange} 
            onChange={handleDateRange} 
            minRangeBounds={{
              startDate:  addYears(new Date(), -10),
              endDate:    addYears(new Date(), 10)
            }}
          />
        </div>
      </div>
      
      <div className='list-group-item content-bg'>
        <div className='content-bg text-start mx-auto p-0'>
          <p className='mt-2 align-center' style={{fontFamily: 'monospace', whiteSpace: "pre-wrap"}}>{getOutput()}</p>
        </div>
      </div>
    </div>
  );
}

export { OutputBox };
export type { Outputs };