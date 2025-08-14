import "./App.css";

import { Routes, Route, HashRouter } from "react-router-dom";

import MainPage from "./MainPage";
import DetailPage from "./DetailPage";
import ContributionsPage from "./ContributionsPage";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/details/:id/:method" element={<DetailPage />} />
        <Route path="/contributions" element={<ContributionsPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
