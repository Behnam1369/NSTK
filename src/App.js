import { Routes, Route, BrowserRouter } from "react-router-dom";
import Mission from "./pages/Mission/Mission";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/users/:iduser/missions/new" element={<Mission />} />
          <Route
            path="/users/:iduser/missions/:idmission"
            element={<Mission />}
          />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
