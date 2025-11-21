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
            marginBottom: "25rem",
          }}
        >
          <div
            style={{
              color: "red",
              fontSize: "large",
              marginBottom: "0.5rem",
            }}
          >
            {`Oops! You tried to visit ${params.id}/${params.method} but something went wrong.`}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Button variant="primary" onClick={() => navigate(0)}>
              Try Again
            </Button>
            <Button variant="primary" onClick={() => navigate("/")}>
              Home Page
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
}
