import { addYears } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { DateRange, type RangeKeyDict } from "react-date-range";
import type { Range } from "react-date-range";
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import formatDate from "../../processes/formatDate";

interface Props {
  className?: string;
  minRangeBounds?: Range;
  range: Range;
  onChange: (rangesByKey: RangeKeyDict) => void;
}

const defaultRangeBounds = {
  startDate: addYears(new Date(), -1), 
  endDate: addYears(new Date(), 1),
  key: 'selection'
} as Range;

function DateRangeButton({ className, minRangeBounds = defaultRangeBounds, range, onChange }: Props) {
  const [isDropdownVisible, setDropdownVisibility] = useState(false);
  const toggleDropdown = () => setDropdownVisibility(!isDropdownVisible);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownVisibility(false);
      }
    }
    document.body.addEventListener('click', handler);
    return () => document.body.removeEventListener('click', handler);
  }, []);

  const formatRange = (range: Range) => {
    if (typeof(range.startDate) === 'undefined') {
      return 'Choose date(s)';
    }

    if (typeof(range.endDate) === 'undefined' || range.startDate.valueOf() === range.endDate.valueOf()) {
      return formatDate(range.startDate);
    }

    return formatDate(range.startDate) + ' → ' + formatDate(range.endDate);
  }

  // typescript can't tell that these scenarios aren't possible
  if (typeof(defaultRangeBounds.startDate) === 'undefined' || typeof(defaultRangeBounds.endDate) === 'undefined') return;
  const minRangeBoundsCopy = {
    startDate: minRangeBounds.startDate,
    endDate: minRangeBounds.endDate,
    key: minRangeBounds.key
  }

  if (typeof(minRangeBoundsCopy.startDate) === 'undefined') {
    minRangeBoundsCopy.startDate = defaultRangeBounds.startDate;
  }

  if (typeof(minRangeBoundsCopy.endDate) === 'undefined') {
    minRangeBoundsCopy.endDate = defaultRangeBounds.endDate;
  }

  const minDate = minRangeBoundsCopy.startDate.getTime() < defaultRangeBounds.startDate.getTime() ? minRangeBounds.startDate : defaultRangeBounds.startDate;
  const maxDate = minRangeBoundsCopy.endDate.getTime() > defaultRangeBounds.endDate.getTime() ? minRangeBounds.endDate : defaultRangeBounds.endDate;

  return (
    <>
      <div className={'dropdown form-control form-control-sm text-center border border-end-0 ' + className} ref={dropdownRef}>
        <button 
          className='dropdown-item' 
          onClick={toggleDropdown}
        >{formatRange(range)}</button>
        <div className={'dropdown-menu p-0' + (isDropdownVisible && ' show')}>
          <DateRange
            onChange        = {rangesByKey => onChange(rangesByKey)}
            minDate         = {minDate}
            maxDate         = {maxDate}
            ranges          = {[range]}
            direction       = 'vertical'
            showMonthArrow  = {true}
            className       = 'rounded'
          />
        </div>
      </div>
      <button className={'input-group-text btn border border-start-0 px-2 py-0 content-bg ' + className} onClick={() => {onChange({selection: {startDate: undefined, endDate: undefined, key: 'selection'}})}}>ⓧ</button>
    </>
  );
}

export default DateRangeButton;