import "./App.css";

import { Routes, Route, HashRouter } from "react-router-dom";
import { Suspense, lazy } from "react";

import MainPage from "./MainPage";
import DetailPage from "./DetailPage";
import LoadingPage from "./LoadingPage";
// import ContributionsPage from "./ContributionsPage";

// Lazy load Contributions to avoid prebundling Markdown js libraries.
const ContributionsPage = lazy(() => import("./ContributionsPage"));

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/details/:id/:method" element={<DetailPage />} />
        <Route
          path="/contributions"
          element={
            <Suspense fallback={<LoadingPage />}>
              <ContributionsPage />
            </Suspense>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
