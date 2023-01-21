import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Mission from "./pages/Mission/Mission";
import MissionPayments from "./pages/Mission/MissionPayments";
import MissionReports from "./pages/Mission/MissionReports";
import PR from "./pages/PR/PR";
export const AppContext = React.createContext();

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 750;
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  return (
    <div className="App">
      <AppContext.Provider value={{ isMobile }}>
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
            <Route
              path="/users/:iduser/missions/:idmission/missioners/:idmissioner/reports"
              element={<MissionReports />}
            />
            <Route path="/users/:iduser/pr/:idpr" element={<PR />} />
            <Route path="/users/:iduser/pr/new" element={<PR />} />
            <Route path="*" element={<h1>404</h1>} />
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    </div>
  );
}

export default App;
