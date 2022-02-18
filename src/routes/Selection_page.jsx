import { Link, Outlet, useNavigate } from "react-router-dom";
import React, { Component } from 'react';
import { render } from "@testing-library/react";
import Table from 'react-bootstrap/Table';
import { useTable, useSortBy, usePagination } from "react-table";

const compounds_link = "https://www.materialscloud.org/mcloud/api/v2/discover/mc3d/compounds";

function My_table(props){
  /*
  function to render a table using react-table library
  */
  var compounds = props.compounds;
  var result = [];
  Object.keys(compounds).map((i)=>{
    Object.keys(compounds[i]).map((j)=>{
      result.push({...compounds[i][j], ...{formula: i}});
    })
  });
  const navigate = useNavigate();
  const goRouteId = (cell) => {
      if (cell.column.id === "id"){
        navigate(`/details/${cell.row.original.formula}/${cell.value}`);
        //console.log(cell.row.original.formula);
      }
     }
  const data = React.useMemo(
    () => result,
    []
  );
  const columns = React.useMemo(
    () => [
      {
        Header: 'MC3D-ID',
        accessor: 'id', // accessor is the "key" in the data
      },
      {
        Header: 'Formula',
        accessor: 'formula',
        Cell: FormulaCell
      },
      {
        Header:'Spacegroup international',
        accessor: 'spg',
      },
      {
        Header:'Spacegroup number',
        accessor: 'spgn',
      }
    ],
    []
 
  );
  const tableInstance = useTable({ columns, data, initialState: { pageIndex: 0 }, }, useSortBy, usePagination);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    //rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;
  return (
    <>
    <Table {...getTableProps()}>
      <thead>
        {
        headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {
            headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {
                column.render('Header')}
                {/* Add a sort direction indicator */}
                <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
 
      {/* Apply the table body props */}
 
      <tbody {...getTableBodyProps()}>
        {
 //firstPageRows.map(row => {
  page.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {
              row.cells.map(cell => {
                return (
                  <td {...cell.getCellProps()} onClick={()=> goRouteId(cell)}>
                    {
                    cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </Table>
    <div className="pagination"> {/*Pagination buttons*/}
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
 
  )
}


function Search_table(props) {
  /* Function to render a react-bootstrap table, no sorting, pagination*/
    var compounds = props.compounds;
    var keys = Object.keys(compounds);
    const navigate = useNavigate();
    const goRouteId = (id) => {
      navigate(`/details/${id}`);
     }
    return (
      <Table className="table attribute-table numbers-font-family">
          <thead >
            <tr>
              <th>MC3D-ID</th>
              <th>Formula</th>
              <th>Spacegroup international</th>
              <th>Spacegroup number</th>
            </tr>
          </thead>
          <tbody>
          {
            keys.map(i => {
              return(
              <tr key= {i} onClick={()=> goRouteId(compounds[i].formula)}>
              <td key={`${i}id`}>{i}</td>
              <td key = {`${i}formula`}>{FormulaCell(compounds[i].formula)}</td>
              <td key={`${i}spg`}>{compounds[i].spg}</td>
              <td key={`${i}spgn`}>{compounds[i].spgn}</td>
            </tr>);
            })
            
            
          }
          </tbody>
          </Table>
    );
}

class SelectionPage extends Component {
  /* Main component to render the Selection Page */
  constructor(props){
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      data: [],
    };    
  }
  componentDidMount(){
    fetch(compounds_link, { method: 'get' })
    .then(res => res.json())
    .then(
      r => {
        this.setState({
          isLoaded: true,
          data: r.data.compounds,
        });
      },(error) => {
        this.setState({
          isLoaded: true,
          error
        });
      });
    }
    render(){
    const error = this.state.error;
    let isLoaded = this.state.isLoaded;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>loading...</div>;
    } else {
    return (
      <My_table compounds ={this.state.data}/>

    );
          }
    }
  }

export default SelectionPage;

function FormulaCell({value, }){
  /*Function formats chemical formula making numbers a subscript.
  Takes name - string contaning structure name
  */
  var myRe = /(\d+)/g;
  var list = value.split(myRe);
  var result = [];
  for (var item of list){
  if (myRe.test(item)){
    result.push(<sub>{item}</sub>);
  }
  else {
    result.push(item)
  }
  }
  return result;
}

/*
Previous way of displaying links:
export default function Compounds(){
  return (
    <div style={{ display: "flex" }}>
      <nav
      style={{
        //borderRight: "solid 1px",
        padding: "1rem"
      }}
    >
        {compound_list.map(compound => (
          <Link style={{ display: "block", margin: "1rem 0" }}
            to={`/details/${compound}`}
            key={compound}
          >
            {compound}
          </Link>
        ))}
        </nav>
      <Outlet />
    </div>
  );
}*/