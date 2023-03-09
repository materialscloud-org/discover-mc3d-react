import React from "react";

export default function McloudSpinner() {
  return (
    <div
      style={{
        background: "transparent",
        border: "none",
        textAlign: "center",
      }}
    >
      <img
        src={"./mcloud_spinner.svg"}
        style={{ height: "60px", margin: "40px" }}
      />
    </div>
  );
}
