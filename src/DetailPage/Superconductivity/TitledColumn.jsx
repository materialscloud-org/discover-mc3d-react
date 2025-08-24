import { Col } from "react-bootstrap";
import { McloudSpinner } from "mc-react-library";

export function TitledColumn({
  width,
  title,
  loading,
  condition,
  fallback,
  children,
  style = {},
  className = "",
  titleStyle = {},
  titleClassName = "",
}) {
  // Determine what will be rendered
  const content = loading ? (
    <div className="flex justify-center items-center w-100 h-full">
      <div style={{ maxWidth: "70px", width: "100%" }}>
        <McloudSpinner />
      </div>
    </div>
  ) : condition ? (
    children
  ) : (
    fallback || null
  );

  // Only render title if there’s something to show and title exists
  return content ? (
    <Col
      md={width}
      className={`flex flex-col ${className}`}
      style={{ minHeight: "300px", ...style }}
    >
      {title && (
        <div
          className={`subsection-title w-100 mb-3 ${titleClassName}`}
          style={{ marginBottom: "0.5rem", ...titleStyle }}
        >
          {title}
        </div>
      )}
      {content}
    </Col>
  ) : null; // Render nothing if content is null
}

export default TitledColumn;
