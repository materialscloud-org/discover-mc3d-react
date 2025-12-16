import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { MCTable } from "../../common/MCTable";

const S3_ROOT_URL =
  "https://rgw.cscs.ch/matcloud:mc-public/mc3d_similarity_info";

export default function SimilaritySection({ params }) {
  const { id, method } = params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !method) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const url = `${S3_ROOT_URL}/${method}/${id}.json`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`File not found: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, method]);

  if (loading) return <Row></Row>;
  if (error) return <Row></Row>;

  const sims = (data?.comparisons ?? []).filter((comp) => comp.rms <= 0.5);

  // table headings
  const header = ["RMS", "Max site distance", "Link"];

  // convert comparisons → table rows
  const contents = sims.map((comp) => {
    const methodString = comp.method.replace(/^mc3d-/, "");
    const url = `#/details/${comp.mc3d_id}/${methodString}`;
    const label = `${comp.mc3d_id}/${methodString}`;

    return [
      comp.rms.toFixed(4),
      comp.max.toFixed(4),
      <a href={url} rel="noopener noreferrer">
        {label}
      </a>,
    ];
  });

  return (
    <div>
      <div className="section-heading">Similar Structures</div>

      <Container fluid className="section-container">
        <p className="d-inline-block me-2">
          The structures in the following pages have been determined to be
          similar:
        </p>

        {sims.length > 0 ? (
          <MCTable
            headerRow={header}
            contents={contents}
            style={{ maxHeight: "332px" }}
          />
        ) : (
          <span>No similarity data found.</span>
        )}
      </Container>
    </div>
  );
}
