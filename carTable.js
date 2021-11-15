/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-array-index-key */
import React from 'react';
import styled from 'styled-components';
import {
  useTable, useFilters, useRowSelect, useGlobalFilter, usePagination,
} from 'react-table';
// A great library for fuzzy filtering/sorting items
import { matchSorter } from 'match-sorter';
import Checkbox from '@mui/material/Checkbox';
import makeData from './makeData';

// const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid rgba(225, 227, 229, 1);

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      color:black;
      margin: 10px;
      padding: 10px;
      border-bottom: 1px solid black;
      border-right: 1px solid white;
      height:40px;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

// Define a default UI for filtering
const GlobalFilter = function ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
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

// Define a default UI for filtering
const DefaultColumnFilter = function ({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search Last Name ${count} records...`}
    />
  );
};

// This is a custom filter UI for selecting
// a unique option from a list
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
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
const SliderColumnFilter = function ({
  column: {
    filterValue, setFilter, preFilteredRows, id,
  },
}) {
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

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
// const NumberRangeColumnFilter = function ({
//   column: {
//     filterValue = [], preFilteredRows, setFilter, id,
//   },
// }) {
//   const [min, max] = React.useMemo(() => {
//     let minimum = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
//     let maximum = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
//     preFilteredRows.forEach((row) => {
//       minimum = Math.min(row.values[id], minimum);
//       maximum = Math.max(row.values[id], maximum);
//     });
//     return [minimum, maximum];
//   }, [id, preFilteredRows]);

//   return (
//     <div
//       style={{
//         display: 'flex',
//       }}
//     >
//       <input
//         value={filterValue[0] || ''}
//         type="number"
//         onChange={(e) => {
//           const val = e.target.value;
//           setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]]);
//         }}
//         placeholder={`Min (${min})`}
//         style={{
//           width: '70px',
//           marginRight: '0.5rem',
//         }}
//       />
//       to
//       <input
//         value={filterValue[1] || ''}
//         type="number"
//         onChange={(e) => {
//           const val = e.target.value;
//           setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined]);
//         }}
//         placeholder={`Max (${max})`}
//         style={{
//           width: '70px',
//           marginLeft: '0.5rem',
//         }}
//       />
//     </div>
//   );
// };

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <Checkbox ref={resolvedRef} {...rest} />
    );
  },
);
// Our table component
const Table = function ({ columns, data }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => rows.filter((row) => {
        const rowValue = row.values[id];
        return rowValue !== undefined
          ? String(rowValue)
            .toLowerCase()
            .startsWith(String(filterValue).toLowerCase())
          : true;
      }),
    }),
    [],
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    [],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page
    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds },
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 2 },
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    usePagination, // usePagination
    useRowSelect, //  useRowSelect
    (hooks) => {
      hooks.visibleColumns.push((cols) => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...cols,
      ]);
    },
  );

  // We don't want to render all of the rows for this example, so cap
  // it for this use case
  // const firstPageRows = rows.slice(0, 20);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} style={{ border: 'none' }}>
                  {column.render('Header')}
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
          <tr>
            <th
              colSpan={visibleColumns.length}
              style={{
                textAlign: 'left', border: 'none', color: 'blue',
              }}
            >
              <GlobalFilter
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
            </th>
          </tr>
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>

                {row.cells.map((cell) => <td {...cell.getCellProps()}>{cell.render('Cell')}</td>)}

              </tr>
            );
          })}
        </tbody>
      </table>
      {/*
        Pagination can be built however you'd like.
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        <button type="button" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>
        {' '}
        <button type="button" onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>
        {' '}
        <button type="button" onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>
        {' '}
        <button type="button" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>
        {' '}
        <span>
          Page
          {' '}
          <strong>
            {pageIndex + 1}
            {' '}
            of
            {pageOptions.length}
          </strong>
          {' '}
        </span>
        <span>
          | Go to page:
          {' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(pageNumber);
            }}
            style={{ width: '100px' }}
          />
        </span>
        {' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSizeNumber) => (
            <option key={pageSizeNumber} value={pageSizeNumber}>
              Show
              {' '}
              {pageSizeNumber}
            </option>
          ))}
        </select>

      </div>

      <div>
        <pre>
          <code>
            {JSON.stringify(
              {
                selectedRowIds,
                'selectedFlatRows[].original': selectedFlatRows.map(
                  (d) => d.original,
                ),
              },
              null,
              2,
            )}
          </code>
        </pre>
      </div>
    </>
  );
};

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

const App = function () {
  const columns = React.useMemo(
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
