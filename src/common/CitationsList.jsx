import { FaBook } from "react-icons/fa";
import { DoiBadge } from "mc-react-library";

import "./CitationsList.css";

export const CitationText = ({ info }) => (
  <div
    style={{
      padding: "2px",
      display: "flex",
      gap: "6px",
      alignItems: "center",
    }}
  >
    <a
      className="citation-a"
      href={`https://doi.org/${info.doi}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaBook size={16} color="black" /> {info.authorsText}, {info.journalText},
      ({info.year})
    </a>
    <DoiBadge doi={info.doi} label="Paper DOI" color="#a2e5b7" />
  </div>
);

const CITATION_MAPPING = {
  Mounet18: {
    authorsText: "Mounet et al.",
    journalText: "Nat. Nanotech. 13, 246-252",
    doi: "10.1038/s41565-017-0035-5",
    year: 2018,
  },
  Campi23: {
    authorsText: "Campi et al.",
    journalText: "ACS Nano 17, 12, 11268-11278",
    doi: "10.1021/acsnano.2c11510",
    year: 2023,
  },
  MBercxSupercon25: {
    authorsText: "Bercx et al.",
    journalText: "PRX Energy 4, 033012 ",
    doi: "10.1103/sb28-fjc9",
    year: 2025,
  },
  HuberMc3d25: {
    authorsText: "Huber et al.",
    journalText: "arXiv:2508.19223",
    doi: "10.48550/arXiv.2508.19223",
    year: 2025,
  },
};

export const CitationsList = ({
  citationLabels,
  containerStyle = { marginLeft: "8px" },
}) => (
  <div style={containerStyle}>
    {citationLabels.map((label) => (
      <CitationText key={label} info={CITATION_MAPPING[label]} />
    ))}
  </div>
);
