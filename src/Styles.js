import styled from 'styled-components';

const Styles = styled.div`
  padding: 1rem;
  font-size: 1.3rem;

  text-align: center;
  
  .pagination {
    padding: 0.5rem;
    font-size: 1.3rem;
  }
  .pagination button, input, select{
    color: black;
    padding: 8px 16px;
    text-decoration: none;
    background: #E9EFF6;
    font-size: 1.3rem;
  }
  .pagination select{
    color: black;
    padding: 8px 16px;
    text-decoration: none;
    background: #E9EFF6;
  }
`;

const Input = styled.input`
  font-size: 1.1rem;
  width: 45%;
  padding: 10px;
  margin: 10px;
  background: #E9EFF6;
  border: none;
  border-radius: 3px;
`;

const StyledTable = styled.table`
  border-spacing: 0;
  width: 100%;
  font-size: 1.2rem;
  margin-bottom: 3rem;
  border: none;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
  border-radius: 25px;
  fontSize: 1.5rem;
  

  th,td {
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

  tr {
    :last-child {
      td {
        border-bottom: 0;
      }
    }
  }

  thead > tr > th {
    border: none;
    text-align: start;
  };

  tbody > tr {
    :hover {
      background-color: #E9EFF6;
    }
  };

  tbody > tr > td {
    text-align: start;
    border-bottom: 3px solid #E9EFF6
  };
`;

export {
  Styles,
  Input,
  StyledTable,
};
