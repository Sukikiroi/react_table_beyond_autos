import React from 'react';

const SliderColumnFilter = ({
  column: {
    filterValue, setFilter, preFilteredRows, id,
  },
}) => {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let minimum = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let maximum = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      minimum = Math.min(row.values[id], min);
      maximum = Math.max(row.values[id], max);
    });
    return [minimum, maximum];
  }, [id, preFilteredRows]);

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={(e) => {
          setFilter(parseInt(e.target.value, 10));
        }}
      />
      <button type="button" onClick={() => setFilter(undefined)}>Off</button>
    </>
  );
};

export default SliderColumnFilter;
