import Table from "react-bootstrap/Table";

import "./MCTable.css";

function formatIfFloat(value, precision) {
  if (typeof value === "number" && !isNaN(value)) {
    return value.toFixed(precision);
  }
  return value;
}

export const MCTable = ({
  headerRow,
  contents,
  floatPrecision = 4,
  style = null,
}) => {
  // headerRow - array of header labels
  // contents - array for each row (needs to match header size)
  return (
    <div
      className="mc-data-table-container subsection-shadow overflow-auto rounded"
      style={style}
    >
      <Table bordered style={{ margin: 0 }}>
        <thead>
          <tr>
            {headerRow.map((h, i) => (
              <th key={i} className="px-2 py-2">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contents.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{formatIfFloat(cell, floatPrecision)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
