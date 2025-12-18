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

export const WarningBoxOtherMethod = ({ method, id }) => {
  // Build the hash-router URL to this method
  const methodUrl = `#/details/${id}/${method}`;

  return (
    <div
      className="alert alert-warning"
      style={{ margin: "10px 10px 20px 10px" }}
      role="alert"
    >
      Warning: This section has been calculated starting from the structure in
      the{" "}
      <a style={{ color: "black" }} href={methodUrl}>
        {method}
      </a>{" "}
      sub-database instead of the currently selected one.
    </div>
  );
};
