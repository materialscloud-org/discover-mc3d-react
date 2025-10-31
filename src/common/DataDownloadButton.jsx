import Button from "react-bootstrap/Button";

export default function DataDownloadButton({
  data,
  filename = "BlankData.json",
}) {
  const handleDownload = () => {
    // convert data to json.
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Button
      size="sm"
      style={{ margin: "4px", padding: "2px 7px" }}
      title="Download"
      onClick={handleDownload}
    >
      <span className="bi bi-download" />
    </Button>
  );
}
