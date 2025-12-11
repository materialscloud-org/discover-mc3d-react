import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";

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

  // handle edge cases.
  if (loading) return <Row></Row>;
  if (error) return <Row></Row>;

  // remove entries from sims if the rms is very large.
  const sims = (data?.comparisons ?? []).filter((comp) => comp.rms <= 0.5);

  return (
    <div>
      <div className="section-heading">Similar Structures</div>

      <Container fluid className="section-container">
        <p className="d-inline-block me-2">
          The structures in the following pages have been determined to be
          similar:
        </p>

        <div className="d-inline-flex flex-wrap gap-1 align-items-center">
          {sims.length > 0 ? (
            sims.map((comp, idx) => {
              const method_string = comp.method.replace(/^mc3d-/, "");
              const url = `#/details/${comp.mc3d_id}/${method_string}`;
              const label = `${comp.mc3d_id}/${method_string}`;

              return (
                <a
                  key={idx}
                  href={url}
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary rounded-lg px-2"
                >
                  {label}
                </a>
              );
            })
          ) : (
            <span>No similarity data found.</span>
          )}
        </div>
      </Container>
    </div>
  );
}
