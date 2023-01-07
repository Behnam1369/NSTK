import { Routes, Route, BrowserRouter } from "react-router-dom";
import Mission from "./pages/Mission/Mission";
import MissionPayments from "./pages/Mission/MissionPayments";
import PR from "./pages/PR/PR";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/users/:iduser/mission/new" element={<Mission />} />
          <Route
            path="/users/:iduser/mission/:idmission"
            element={<Mission />}
          />
          <Route
            path="/users/:iduser/missions/:idmission"
            element={<Mission />}
          />
          <Route
            path="/users/:iduser/missions/:idmission/missioners/:idmissioner/payments"
            element={<MissionPayments />}
          />
          <Route path="/users/:iduser/pr/:idpr" element={<PR />} />
          <Route path="/users/:iduser/pr/new" element={<PR />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
