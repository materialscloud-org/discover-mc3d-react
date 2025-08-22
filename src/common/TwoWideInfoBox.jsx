import "./TwoWideInfoBox.css";

export const TwoWideInfoBox = ({
  childrenLeft,
  childrenRight,
  style = null,
}) => {
  return (
    <div style={style}>
      <div className="two-wide-container subsection-shadow overflow-auto rounded">
        <div className="info-col">{childrenLeft}</div>
        <div className="info-col">{childrenRight}</div>
      </div>
    </div>
  );
};
