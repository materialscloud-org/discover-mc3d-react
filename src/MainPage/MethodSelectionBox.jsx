import { Form, Popover } from "react-bootstrap";

import { HelpButton } from "mc-react-library";

import "./MethodSelectionBox.css";

const popover = (
  <Popover id="popover-basic">
    <Popover.Header>
      <b>Methodology-based subdatabases</b>
    </Popover.Header>
    <Popover.Body style={{ textAlign: "justify" }}>
      <p>
        The MC3D consists of subdatabases which have been calculated with a
        single consistent computational approach. The label contains the
        exchange-correlation functional that was used and a version number that
        represents the rest of the computational protocol. See the "About" tab
        and the publication (in preparation) for more detailed information.
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
        <p>Select a dataset:</p>
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
