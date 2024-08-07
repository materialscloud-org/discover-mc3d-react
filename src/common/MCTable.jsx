import Table from "react-bootstrap/Table";

import "./MCTable.css";

function formatIfFloat(value, precision) {
  if (typeof value === "number" && !isNaN(value)) {
    return value.toFixed(precision);
  }
  return value;
}

export const MCTable = ({ title, headerRow, contents, floatPrecision = 4 }) => {
  // headerRow - array of header labels
  // contents - array for each row (needs to match header size)

  console.log(contents);
  return (
    <>
      <div className="mc-data-table-title">{title}</div>
      <div className="mc-data-table-container overflow-auto rounded">
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
    </>
  );
};
