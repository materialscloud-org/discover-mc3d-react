import { Container, Button } from "react-bootstrap";
import TitleAndLogo from "../common/TitleAndLogo";
import MaterialsCloudHeader from "mc-react-header";

// full page error component to handle when data is missing.
export default function MissingDataWarning({ params, navigate }) {
  return (
    <>
      <MaterialsCloudHeader
        activeSection="discover"
        breadcrumbsPath={[
          { name: "Discover", link: "https://www.materialscloud.org/discover" },
          {
            name: "Materials Cloud Three-Dimensional Structure Database",
            link: `${import.meta.env.BASE_URL}`,
          },
          { name: `${params.id}/${params.method}`, link: null },
        ]}
      />
      <Container fluid="xxl">
        <TitleAndLogo />
        <div
          style={{
            textAlign: "center",
            marginTop: "5rem",
            marginBottom: "10rem",
          }}
        >
          <div
            style={{
              color: "red",
              fontSize: "1.2rem",
              marginBottom: "2rem",
            }}
          >
            {`Warning: Fetching of data failed, suggesting that ${params.id} has not been calculated with ${params.method}`}
          </div>
          <Button variant="primary" onClick={() => navigate("/")}>
            Return to MC3D homepage
          </Button>
        </div>
      </Container>
    </>
  );
}
