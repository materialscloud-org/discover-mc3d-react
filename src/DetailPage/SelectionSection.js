import React from "react";

import Form from "react-bootstrap/Form";

import { useNavigate } from "react-router-dom";

import "./SelectionSection.css";

function extractIntId(strId) {
  return parseInt(strId.split(/-|\//)[1]);
}

function SelectionSection(props) {
  const navigate = useNavigate();

  let formula = props.currentStructure.compound;

  let currentId = `${props.currentStructure.id}/${props.currentStructure.functional}`;
  let currentSg = null;
  let otherArr = [];

  props.sameFormulaStructures.ids.forEach((id, index) => {
    let sg = props.sameFormulaStructures.spacegrps[index];
    if (id == currentId) {
      currentSg = sg;
    } else {
      otherArr.push({ id: id, sg: sg });
    }
  });
  // sort by the numerical value of mc3d-id
  otherArr.sort((a, b) => extractIntId(a.id) - extractIntId(b.id));

  return (
    <div className="selection-section">
      <b>Related structures</b>
      <br />
      <span>
        Crystals with this chemical formula
        <Form.Select
          size="sm"
          style={{
            width: "380px",
            display: "inline",
            margin: "4px 6px 2px 6px",
          }}
          onChange={(v) => {
            navigate(
              `${process.env.PUBLIC_URL}/details/${formula}/${v.target.value}`
            );
            // navigate(0);
          }}
        >
          <option>
            {currentId} (spacegroup {currentSg}) (current)
          </option>
          {otherArr.map((e) => (
            <option key={e.id} value={e.id}>
              {e.id} (spacegroup {e.sg})
            </option>
          ))}
        </Form.Select>
      </span>
    </div>
  );
}

export default SelectionSection;
