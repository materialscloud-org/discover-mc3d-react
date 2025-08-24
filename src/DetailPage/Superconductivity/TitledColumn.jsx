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

  if (!content) return null; // Nothing to render if no content

  return (
    <Col
      md={width}
      className={`flex flex-col ${className}`}
      style={{ minHeight: "300px", ...style }}
    >
      {/* Always render the title div if there’s content */}
      <div
        className={`subsection-title w-100 mb-3 ${titleClassName}`}
        style={{ marginBottom: "0.5rem", ...titleStyle }}
      >
        {title || "\u00A0"} {/* Render non-breaking space if title is empty */}
      </div>
      {content}
    </Col>
  );
}

export default TitledColumn;
