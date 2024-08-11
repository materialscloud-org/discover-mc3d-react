import { saveAs } from "file-saver";

import "./DownloadButton.css";

export const DownloadButton = ({ materialSelectorRef, disabled }) => {
  /*
    Note: the plan is to potentially also include direct download links (via the AiiDA rest api)
    to each of the materials in the downloaded file, but currently the index page doesn't have
    the structure UUIDs. Including them in the default index download is not great, as they would
    increase the initial download size considerably, while not really needed for the table.
    
    Therefore, it probably might make sense to implement an additional endpoint, e.g. pbe-v1/uuids
    that is only called when this download button is clicked.
  */

  const handleDownload = () => {
    if (materialSelectorRef.current) {
      const data = materialSelectorRef.current.getFilteredRows();
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const filename = `mc3d_index_data_n${data.length}.json`;
      saveAs(blob, filename);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled}
      className={`aggrid-style-button ${disabled ? "aggrid-style-button-disabled" : ""}`}
      style={{ marginTop: "5px" }}
    >
      Download filtered entries
    </button>
  );
};
