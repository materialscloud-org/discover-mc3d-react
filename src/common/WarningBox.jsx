export const WarningBox = ({ children }) => {
  return (
    <div
      className="alert alert-warning"
      style={{ margin: "10px 10px 5px 10px" }}
      role="alert"
    >
      {children}
    </div>
  );
};

export const WarningBoxOtherMethod = ({ method }) => {
  return (
    <div
      className="alert alert-warning"
      style={{ margin: "10px 10px 5px 10px" }}
      role="alert"
    >
      Warning: This section has been calculated starting from the structure in
      the <strong>{method}</strong> sub-database instead of the currently
      selected one.
    </div>
  );
};
