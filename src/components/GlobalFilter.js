import React, { useState } from 'react';

const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) => {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = () => {
    setGlobalFilter(value || undefined);
  };

  // This Make regeneratorruntime is not defined Error
  // useAsyncDebounce(value => {
  //   setGlobalFilter(value || undefined)
  // }, 200)

  return (
    <span>
      Search:
      {' '}
      <input
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: '1.1rem',
          border: '2px solid black',

        }}
      />
    </span>
  );
};

export default GlobalFilter;
