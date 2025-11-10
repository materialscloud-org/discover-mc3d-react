import init, { analyze_cell } from "@spglib/moyo-wasm";
import wasmUrl from "@spglib/moyo-wasm/moyo_wasm_bg.wasm?url"; // need this ?url to ensure wasm not html.

import { MCInfoBox } from "../../common/MCInfoBox";

import { Row, Col, Container } from "react-bootstrap";

import React, { useState, useEffect } from "react";

import { ToggleSwitch } from "mc-react-library";

import { matrix, getPrimToConvMatrix } from "mc-react-library";

import { mat3, vec3 } from "gl-matrix";

import { MCTable } from "../../common/MCTable";

let wasmReady = false;
async function analyzeCrystal(lattice, positions, numbers) {
  // Initialize WASM only once
  if (!wasmReady) {
    await init(wasmUrl);
    wasmReady = true;
  }

  const basis = lattice.flat();
  const cell = {
    lattice: { basis },
    positions,
    numbers,
  };

  return analyze_cell(JSON.stringify(cell), 1e-4, "Standard");
}

// Convert Cartesian → Fractional coordinates
function cartesianToFractional(positionsCart, lattice) {
  const latticeMat = mat3.fromValues(...lattice.flat());

  // Compute inverse of lattice matrix
  const invLattice = mat3.create();
  mat3.invert(invLattice, latticeMat);

  // Transform each Cartesian position
  return positionsCart.map((pos) => {
    const frac = vec3.create();
    vec3.transformMat3(frac, pos, invLattice);
    return Array.from(frac);
  });
}

export default function SpgLibInfoBox({ structureInfo }) {
  const [spgLibResults, setSpgLibResults] = useState(null);
  const [showPrimitive, setShowPrimitive] = useState(true);
  const [showFractional, setShowFractional] = useState(true);

  const aiidaAttr = structureInfo.aiidaAttributes;

  const lattice = aiidaAttr.cell;
  const positionsCart = aiidaAttr.sites.map((x) => x.position);
  const positionsFrac = cartesianToFractional(positionsCart, lattice);

  // assume that an equivalent kind_name = the same species.
  const elements = aiidaAttr.sites.map((s) => s.kind_name?.trim());

  //
  const uniqueKinds = [...new Set(elements)];

  const kindToId = Object.fromEntries(uniqueKinds.map((k, i) => [k, i]));

  // spglib expects the elements to be intergers..
  const elementIds = elements.map((k) => kindToId[k]);
  useEffect(() => {
    async function runAnalysis() {
      try {
        const result = await analyzeCrystal(lattice, positionsFrac, elementIds);

        const idToKind = uniqueKinds; // index = ID

        // Convert prim_std_cell.numbers to element names
        const primStdCell = {
          ...result.prim_std_cell,
          numbers: result.prim_std_cell.numbers.map((num) => idToKind[num]),
        };

        // Optionally convert std_cell.numbers too
        const stdCell = {
          ...result.std_cell,
          numbers: result.std_cell.numbers.map((num) => idToKind[num]),
        };

        const convertedResults = {
          ...result,
          prim_std_cell: primStdCell,
          std_cell: stdCell,
        };

        setSpgLibResults(convertedResults);
      } catch (err) {
        console.error("spglib error:", err);
      }
    }

    runAnalysis();
  }, [structureInfo]);

  // Build the table rows depending on toggle
  const positionTableRows = spgLibResults
    ? (showPrimitive
        ? spgLibResults.prim_std_cell
        : spgLibResults.std_cell
      ).positions.map((pos, i) => [
        (showPrimitive ? spgLibResults.prim_std_cell : spgLibResults.std_cell)
          .numbers[i],
        pos[0].toFixed(4),
        pos[1].toFixed(4),
        pos[2].toFixed(4),
      ])
    : [];

  const cartFracTableRows = (
    showFractional ? positionsFrac : positionsCart
  ).map((pos, i) => [
    elements[i],
    pos[0].toFixed(4),
    pos[1].toFixed(4),
    pos[2].toFixed(4),
  ]);

  return (
    <Container fluid className="section-container">
      {spgLibResults && (
        <>
          <Row>
            <Col>
              <div className="subsection-title">
                Symmetry results from spglib
              </div>
              <MCInfoBox title="General">
                <ul className="no-bullets">
                  <li>Space group number: {spgLibResults.number}</li>
                  <li>Hall number: {spgLibResults.hall_number}</li>
                  <li>
                    Hermann-Mauguin symbol:{" "}
                    {/* write function to pretty print. */}
                    {spgLibResults.hm_symbol.replace(/\s+/g, "")}
                  </li>
                  <li>Pearson symbol: {spgLibResults.pearson_symbol}</li>
                </ul>
              </MCInfoBox>
            </Col>
            <Col>
              <MCTable
                headerRow={["Kind label", "Wyckoff", "Site Sym"]}
                contents={spgLibResults.wyckoffs.map((w, i) => [
                  spgLibResults.prim_std_cell.numbers[i],
                  w,
                  spgLibResults.site_symmetry_symbols[i],
                ])}
                style={{ maxHeight: "332px" }}
              />
            </Col>
          </Row>

          <Row style={{ paddingTop: "15px" }}>
            <Col md={6}>
              <div
                className="subsection-title"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Left-aligned title */}
                <div style={{ flex: 1 }}>
                  <span>Cell position calculation</span>
                </div>

                {/* Right-aligned toggle */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginRight: "5px",
                  }}
                >
                  <ToggleSwitch
                    labelLeft="Primitive"
                    labelRight="Conventional"
                    checked={showPrimitive}
                    switchLength="30px"
                    fontSize="17px"
                    onToggle={() => setShowPrimitive(!showPrimitive)}
                  />
                </div>
              </div>
              <MCTable
                headerRow={["Kind label", "X", "Y", "Z"]}
                contents={positionTableRows}
                style={{ maxHeight: "332px" }}
              />
            </Col>
            <Col md={6}>
              <div
                className="subsection-title"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Left-aligned title */}
                <div style={{ flex: 1 }}>
                  <span>Frac to cart positions (simple gl-mat)</span>
                </div>

                {/* Right-aligned toggle */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginRight: "5px",
                  }}
                >
                  <ToggleSwitch
                    labelLeft="Fractional"
                    labelRight="Cartesian"
                    checked={showFractional}
                    switchLength="30px"
                    fontSize="17px"
                    onToggle={() => setShowFractional(!showFractional)}
                  />
                </div>
              </div>
              <MCTable
                headerRow={["Kind label", "X", "Y", "Z"]}
                contents={cartFracTableRows}
                style={{ maxHeight: "332px" }}
              />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
