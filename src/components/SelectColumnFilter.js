import React from 'react';

const SelectColumnFilter = function ({
  column: {
    filterValue, setFilter, preFilteredRows, id,
  },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const optionsSet = new Set();
    preFilteredRows.forEach((row) => {
      optionsSet.add(row.values[id]);
    });
    return [...optionsSet.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default SelectColumnFilter;
