import React, { useMemo } from 'react';
import './App.css';
import Table from './components/carTable';
import SelectColumnFilter from './components/SelectColumnFilter';
import SliderColumnFilter from './components/SliderColumnFilter';

import makeData from '../makeData';
import Styles from './Styles';

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== 'number';

const App = () => {
  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'password',
            accessor: 'password',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
            // Use our custom `fuzzyText` filter on this column
            filter: 'fuzzyText',
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
            Filter: SliderColumnFilter,
            filter: 'equals',
          },
          // {
          //   Header: 'Visits',
          //   accessor: 'visits',
          //   Filter: NumberRangeColumnFilter,
          //   filter: 'between',
          // },
          {
            Header: 'Status',
            accessor: 'visits',
            Filter: SelectColumnFilter,
            filter: 'includes',
          },
          {
            Header: 'Vendeur de produit',
            accessor: 'status',
            Filter: SelectColumnFilter,
            filter: 'includes',
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
            Filter: SliderColumnFilter,
            filter: filterGreaterThan,
          },
        ],
      },
    ],
    [],
  );

  const data = React.useMemo(() => makeData(100000), []);

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  );
};

export default App;
