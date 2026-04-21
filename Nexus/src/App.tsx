import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import { StreamPage } from "./components/StreamPage";
import { ExternalPage } from "./components/ExternalPage";
import { DecisionPage } from "./components/DecisionPage";
import { PredictionPage } from "./components/PredictionPage";
import { AgentPage } from "./components/AgentPage";
import { GraphView } from "./components/GraphView";

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/"          element={<StreamPage />}    />
          <Route path="/external"  element={<ExternalPage />}  />
          <Route path="/decision"  element={<DecisionPage />}  />
          <Route path="/prediction"element={<PredictionPage />}/>
          <Route path="/agent"     element={<AgentPage />}     />
          <Route path="/graph"     element={<GraphView />}     />
          <Route path="*"          element={<StreamPage />}    />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
