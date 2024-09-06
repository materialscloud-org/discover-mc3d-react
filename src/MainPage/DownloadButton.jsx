import { saveAs } from "file-saver";

import { HelpButton } from "mc-react-library";
import { Popover } from "react-bootstrap";

import "./DownloadButton.css";

const getCurrentDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
};

const popover = (
  <Popover id="popover-basic">
    <Popover.Header>
      <b>Download filtered entries</b>
    </Popover.Header>
    <Popover.Body style={{ textAlign: "justify" }}>
      <p>
        This button allows to download all currently filtered entries shown in
        the Materials Grid. The data is downloaded in JSON format, as an array.
        The array contains a JSON object for each material entry, with key-value
        pairs corresponding to the column properties. Additionally, each entry
        includes a link to the corresponding detail page.
      </p>
    </Popover.Body>
  </Popover>
);

export const DownloadButton = ({
  materialSelectorRef,
  disabled,
  methodLabel,
}) => {
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
      // href currently just contains the url subpath to the details page
      // replace it with a better name and full url
      let modData = data.map((entry) => {
        let modEntry = {
          ...entry,
          details_link: `${window.location.origin}${entry.href}`,
        };
        delete modEntry.href;
        return modEntry;
      });
      const json = JSON.stringify(modData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const filename = `mc3d_filtered_entries_${methodLabel}_${getCurrentDateString()}.json`;
      saveAs(blob, filename);
    }
  };

  return (
    <div className="download-button-outer-container">
      <button
        onClick={handleDownload}
        disabled={disabled}
        className={`aggrid-style-button ${disabled ? "aggrid-style-button-disabled" : ""}`}
        style={{ marginTop: "5px" }}
      >
        Download filtered entries
      </button>
      <HelpButton popover={popover} />
    </div>
  );
};
