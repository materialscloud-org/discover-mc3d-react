import "./MCInfoBox.css";

export const MCInfoBox = ({ children, style, title = null }) => {
  return (
    <div style={style}>
      {title && <div className="mc-info-title">{title}</div>}
      <div className="mc-info-container overflow-auto rounded">{children}</div>
    </div>
  );
};
