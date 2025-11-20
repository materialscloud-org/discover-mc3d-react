import React, { useState } from "react";

import { matrix, ToggleSwitch } from "mc-react-library";

import { MCTable } from "../../common/MCTable";

function cartToFrac(positions, cell) {
  const invCell = matrix.invertMatrix(cell);

  console.log("Cell", cell);
  console.log("Inverse Cell", invCell);

  return positions.map((pos) => [
    invCell[0][0] * pos[0] + invCell[0][1] * pos[1] + invCell[0][2] * pos[2],
    invCell[1][0] * pos[0] + invCell[1][1] * pos[1] + invCell[1][2] * pos[2],
    invCell[2][0] * pos[0] + invCell[2][1] * pos[1] + invCell[2][2] * pos[2],
  ]);
}

export const AtomicSitesInfoBox = ({ structureInfo }) => {
  const [atomsModeState, setAtomsModeState] = useState(false);

  const cell = structureInfo.aiidaAttributes.cell;
  const sites = structureInfo.aiidaAttributes.sites;

  const cartesianData = sites.map((s) => [
    s.kind_name,
    s.position[0].toFixed(4),
    s.position[1].toFixed(4),
    s.position[2].toFixed(4),
  ]);

  const positions = sites.map((s) => s.position);
  const fractionalPositions = cartToFrac(positions, cell);

  const fractionalData = sites.map((s, i) => {
    const frac = fractionalPositions[i];
    return [
      s.kind_name,
      frac[0].toFixed(4),
      frac[1].toFixed(4),
      frac[2].toFixed(4),
    ];
  });

  const headerCartesian = ["Kind label", "x [Å]", "y [Å]", "z [Å]"];
  const headerFractional = ["Kind label", "x", "y", "z"];

  const handleLatticeInfoClick = (checked) => {
    setAtomsModeState(checked);
  };

  return (
    <div>
      <div className="subsection-title flex justify-between items-center">
        <span style={{ flex: 1 }}>Atomic positions</span>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "40px",
            marginRight: "5px",
            alignItems: "stretch",
          }}
        >
          {/* Commented as currently buggy? */}
          {/* <ToggleSwitch
            labelLeft="Cartesian"
            labelRight="Fractional"
            switchLength="30px"
            fontSize="17px"
            onToggle={handleLatticeInfoClick}
          /> */}
        </div>
      </div>

      <MCTable
        headerRow={atomsModeState ? headerFractional : headerCartesian}
        contents={atomsModeState ? fractionalData : cartesianData}
        style={{ maxHeight: "332px" }}
      />
    </div>
  );
};
