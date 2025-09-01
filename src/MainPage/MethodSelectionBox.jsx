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
  return (
    <div className="method-selection-box-outer">
      <div className="method-selection-box">
        <p>Select a methodology:</p>
        <Form.Select
          size="sm"
          value={props.method}
          onChange={props.handleMethodChange}
          style={{
            display: "inline-block",
            margin: "4px 6px 2px 6px",
            width: "auto",
            minWidth: "max-content",
          }}
        >
          {Object.entries(options).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </Form.Select>
        <HelpButton popover={popover} placement="bottom" />
      </div>
    </div>
  );
};
