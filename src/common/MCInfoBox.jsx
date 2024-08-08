import "./MCInfoBox.css";

export const MCInfoBox = ({ children, style = null }) => {
  return (
    <div style={style}>
      <div className="mc-info-container subsection-shadow overflow-auto rounded">
        {children}
      </div>
    </div>
  );
};
