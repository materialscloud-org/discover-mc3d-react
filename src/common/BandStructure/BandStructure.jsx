import React, { useState, useEffect, useRef, useCallback } from "react";
import { BandsVisualiser, splitBandsData } from "bands-visualiser";
import {
  bandsExist,
  computeBandShift,
  shiftBands,
  formatBandsData,
} from "./bandUtils"; // make sure to import utilities

import { loadAiidaBands } from "../restApiUtils";
import { McloudSpinner, ExploreButton } from "mc-react-library";

function BandStructure() {
  const containerRef = useRef(null);
  const visualiserRef = useRef(null);

  const [bandsDataArray, setBandsDataArray] = useState(null);
  const [rawBandsData, setRawBandsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load bands data on mount or when electronicData changes
  useEffect(() => {
    async function fetchBands() {
      setLoading(true);
      try {
        const totalBands = await loadAiidaBands();
        setRawBandsData(totalBands);
        const splitBands = formatBandsData(totalBands, splitBandsData);
        setBandsDataArray(splitBands);
      } catch (e) {
        console.error("Failed to load bands:", e);
        setBandsDataArray(null);
      } finally {
        setLoading(false);
      }
    }

    fetchBands();
  }, []);

  // Visualise BandsData
  useEffect(() => {
    if (!containerRef.current || !bandsDataArray) return;

    // Clean up previous instance if exists
    if (visualiserRef.current?.destroy) {
      visualiserRef.current.destroy();
    }

    visualiserRef.current = BandsVisualiser(containerRef.current, {
      bandsDataArray,
      settings: {
        yaxis: { range: [-5.4, 5.4] },
      },
    });
  }, [bandsDataArray]);

  if (loading) return <div>Loading bands...</div>;
  if (!bandsDataArray) return <div>No bands data available</div>;

  return (
    <div>
      <div ref={containerRef} style={{ width: "100%", height: "450px" }} />
    </div>
  );
}

export default BandStructure;
