import styled from 'styled-components';

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

export default Styles;
