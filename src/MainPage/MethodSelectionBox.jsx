import { Form, Popover } from "react-bootstrap";

import { HelpButton } from "mc-react-library";

import "./MethodSelectionBox.css";

const popover = (
  <Popover id="popover-basic">
    <Popover.Header>
      <b>Datasets & views</b>
    </Popover.Header>
    <Popover.Body style={{ textAlign: "justify" }}>
      <p>
        MC3D contains <b>structure datasets</b> - collections computed with one
        consistent computational approach. The label (e.g., <i>PBEsol-v1</i>)
        contains the physical methodology and a version suffix representing the
        computational protocol.
      </p>
      <p>
        Structure datasets can have associated property contributions (e.g.,
        Superconductivity), and the corresponding <b>property-based views</b>{" "}
        allow to sort and filter the relevant data.
      </p>
      <p>
        Use the menu to select either a structure dataset or a property view.
        See the <b>About</b> tab and the publication for details.
      </p>
    </Popover.Body>
  </Popover>
);

export const MethodSelectionBox = (props) => {
  let options = {
    "pbesol-v2": `PBEsol-v2`,
    "pbesol-v1": `PBEsol-v1`,
    "pbe-v1": `PBE-v1`,
  };

  Object.entries(options).forEach(([key, value]) => {
    if (props.genInfo?.["method-counts"]?.[key] != null) {
      options[key] += ` (${props.genInfo["method-counts"][key]})`;
    }
  });

  // used to spoof values in the display box.
  const displayValue = props.selectedDisplay || props.method;

  return (
    <div className="method-selection-box-outer">
      <div className="method-selection-box">
        <p>Select a dataset or view:</p>
        <Form.Select
          size="sm"
          value={displayValue}
          onChange={props.handleMethodChange}
          style={{
            display: "inline-block",
            margin: "4px 6px 2px 6px",
            width: "auto",
            minWidth: "max-content",
          }}
        >
          <optgroup label="Structure datasets">
            {Object.entries(options).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </optgroup>
          <optgroup label="Property-based views">
            <option value="superconductivity">
              Superconductivity (PBEsol-v1)
            </option>
          </optgroup>
        </Form.Select>

        <HelpButton popover={popover} placement="bottom" />
      </div>
    </div>
  );
};
