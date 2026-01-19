import { useEffect, useRef, useState } from "react";
import { ChromePicker, type ColorResult } from "react-color";

interface Props {
  value: string;
  onChange: (value: ColorResult) => void;
}

function ColorPickerButton({ value, onChange }: Props) {
  
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

  // https://en.wikipedia.org/wiki/relative_luminance
  const getLuminance = () => {
    let luminance = parseInt(value.slice(1, 3), 16) * 0.2126; // R * 0.2126
    luminance +=    parseInt(value.slice(3, 5), 16) * 0.7152; // G * 0.7152
    luminance +=    parseInt(value.slice(5, 7), 16) * 0.0722; // B * 0.0722
    return luminance / 255;
  }

  const getTextColor = () => {
    return (getLuminance() > 0.5) ? '#0f0f0f' : '#f0f0f0';
  }

  return (
    <div className='input-group-text input-group-append m-0 p-0 border border-start-0' style={{backgroundColor: value}} ref={dropdownRef}>
      <button 
        className='input-group-text input-group-append m-0 px-3 py-0 btn' 
        style={{backgroundColor: value, color: getTextColor(), fontFamily: 'monospace', zIndex: 0}}
        onClick={toggleDropdown}
      >{value}</button>
      <div className={'dropdown-menu p-0 ' + (isDropdownVisible && 'show')} style={{zIndex: 3}}>
        <ChromePicker 
          color={value}
          onChange={onChange}
          disableAlpha={true}
          className='rounded'
        />
      </div>
    </div>
  )
}

export default ColorPickerButton;