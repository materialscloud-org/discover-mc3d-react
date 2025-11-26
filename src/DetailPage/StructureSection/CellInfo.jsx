import React, { useState } from "react";

import { ToggleSwitch } from "mc-react-library";

import { matrix, getPrimToConvMatrix } from "mc-react-library";

import { MCTable } from "../../common/MCTable";

function bundleLatticeData({ baseMatrix, transform_matrix = null }) {
  // function to bundle the lattice data to make
  // switch condition logic more readible
  const finalMatrix = transform_matrix
    ? matrix.multiplyMatrices(transform_matrix, baseMatrix)
    : baseMatrix;

  const par = matrix.getMatrixParams(finalMatrix);

  return {
    matrix: finalMatrix,
    angles: [
      par.angles[1][2], // alpha
      par.angles[0][2], // beta
      par.angles[0][1], // gamma
    ],
    lengths: par.lengths,
  };
}

export const CellInfoBox = ({ structureInfo, spacegroup_symbol = "P1" }) => {
  const [latticeInfoState, setLatticeInfoState] = useState(false);
  const [latticeTypeState, setLatticeTypeState] = useState(false);

  const primitive_matrix = structureInfo.aiidaAttributes.cell;
  const transform_matrix = getPrimToConvMatrix(spacegroup_symbol);

  // bundle matrices
  const prim_bundled = bundleLatticeData({ baseMatrix: primitive_matrix });
  const conv_bundled = bundleLatticeData({
    baseMatrix: primitive_matrix,
    transform_matrix: transform_matrix,
  });
  const current = latticeTypeState ? conv_bundled : prim_bundled;

  const handleLatticeTypeClick = () => {
    const newState = !latticeTypeState;
    setLatticeTypeState(newState);
  };

  const handleLatticeInfoClick = () => {
    const newState = !latticeInfoState;
    setLatticeInfoState(newState);
  };

  return (
    <div>
      <div
        className="subsection-title"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Text Align left */}
        <div style={{ flex: 1 }}>
          <span>Cell Info</span>
        </div>
        {/* Switch Align right */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "40px",
            marginRight: "5px",
            alignItems: "stretch",
          }}
        >
          {/* Param to Matrix Switch */}
          <ToggleSwitch
            labelLeft="Parameters"
            labelRight="Matrix"
            switchLength="30px"
            fontSize="17px"
            onToggle={handleLatticeInfoClick}
          />

          {/* Prim to Conv Switch  DROPPED WHILE CONSIDERED BUGGED*/}
          {/* <ToggleSwitch
            labelLeft="Primitive"
            labelRight="Conventional"
            switchLength="30px"
            fontSize="17px"
            onToggle={handleLatticeTypeClick}
          /> */}
        </div>
      </div>

      <div
        style={{
          minHeight: "181px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center", // vertical centering
        }}
      >
        {latticeInfoState ? (
          <div>
            <MCTable //Matrix Render
              headerRow={["", "x [Å]", "y [Å]", "z [Å]"]}
              contents={current.matrix.map((v, i) => [
                <span key={`v${i}`}>
                  v<sub>{i + 1}</sub>
                </span>,
                v[0],
                v[1],
                v[2],
              ])}
            />
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <MCTable // lengths render
              headerRow={["", "a", "b", "c"]}
              contents={[["Lengths [Å]", ...current.lengths]]}
            />
            <MCTable // angles render
              headerRow={["", "α", "β", "γ"]}
              contents={[["Angles [°]", ...current.angles]]}
            />
          </div>
        )}
      </div>
    </div>
  );
};
