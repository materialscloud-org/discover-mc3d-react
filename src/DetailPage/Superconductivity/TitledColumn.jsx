import { Col } from "react-bootstrap";
import { McloudSpinner } from "mc-react-library";

export function TitledColumn({
  width,
  subtitle,
  loading,
  condition,
  fallback,
  children,
  style = {},
  className = "",
  subtitleStyle = {},
  subtitleClassName = "",
}) {
  return (
    <Col
      md={width}
      className={`flex flex-col ${className}`}
      style={{ minHeight: "300px", ...style }}
    >
      {/* Subtitle always renders */}
      <div
        className={`subsection-title w-100 mb-3 ${subtitleClassName}`}
        style={{
          marginBottom: "0.5rem", // default spacing
          ...subtitleStyle,
        }}
      >
        {subtitle || "\u00A0"}
      </div>

      {loading ? (
        <div className="flex justify-center items-center w-100 h-full">
          <div style={{ maxWidth: "70px", width: "100%" }}>
            <McloudSpinner />
          </div>
        </div>
      ) : condition ? (
        children
      ) : fallback ? (
        fallback
      ) : (
        <div
          className={`flex items-center justify-center h-full text-gray-400 border border-dashed rounded p-3`}
        >
          No data
        </div>
      )}
    </Col>
  );
}

export default TitledColumn;
