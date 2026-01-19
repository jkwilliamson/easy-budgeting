import { Children } from "react";

interface Props {
  children?: React.ReactNode;
  name: string;
  onClick: () => void;
}

function InputBox({children, name, onClick}: Props) {
  return (
    <ul className='list-group'>
      <li className='list-group-item content-bg'>
        <span className='fs-3'>{name}</span>
        <button className='btn btn-outline-secondary border-0 fs-4 ms-1 pt-0 pb-1 px-1 align-baseline' onClick={onClick}>+</button>
      </li>
      <li className='list-group-item content-bg text-start'>
        <div>
          { Children.toArray(children).length === 0 ? <p className='mt-2'>No {name.toLowerCase()} to display.</p> : children }
        </div>
      </li>
    </ul>
  );
}

export default InputBox;