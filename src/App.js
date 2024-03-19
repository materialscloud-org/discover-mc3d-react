import React from "react";

import "./App.css";

import MaterialsCloudHeader from "mc-react-header";

import MainPage from "./MainPage";

function App() {
  return (
    <MaterialsCloudHeader
      activeSection={"discover"}
      breadcrumbsPath={[
        { name: "Discover", link: "https://www.materialscloud.org/discover" },
        {
          name: "Materials Cloud three-dimensional crystals database",
          link: null,
        },
      ]}
    >
      <div className="App bs-overrides">
        <MainPage />
      </div>
    </MaterialsCloudHeader>
  );
}

export default App;
