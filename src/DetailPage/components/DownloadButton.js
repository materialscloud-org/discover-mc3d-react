import React from "react";

import Button from "react-bootstrap/Button";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Popover from "react-bootstrap/Popover";

import "./DownloadButton.css";

export default function DownloadButton(props) {
  var dl_url = `https://aiida.materialscloud.org/mc3d/api/v4/nodes/${props.uuid}/download`;
  return (
    <OverlayTrigger
      trigger="click"
      rootClose
      placement={"bottom"}
      overlay={
        <Popover>
          <Popover.Body style={{ padding: "5px 0px" }}>
            <ul className="download-dropdown-menu">
              <li>
                <a href={`${dl_url}?download_format=chemdoodle`}>ChemDoodle</a>
              </li>
              <li>
                <a href={`${dl_url}?download_format=cif`}>CIF</a>
              </li>
              <li>
                <a href={`${dl_url}?download_format=xsf`}>XSF</a>
              </li>
              <li>
                <a href={`${dl_url}?download_format=xyz`}>XYZ</a>
              </li>
            </ul>
          </Popover.Body>
        </Popover>
      }
    >
      <Button
        size="sm"
        style={{ margin: "4px", padding: "2px 6px" }}
        title={"Download"}
      >
        <span className="bi bi-download" />
      </Button>
    </OverlayTrigger>
  );
}
