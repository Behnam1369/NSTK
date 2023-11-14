import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Mission from "./pages/Mission/Mission";
import MissionPayments from "./pages/Mission/MissionPayments";
import MissionReports from "./pages/Mission/MissionReports";
import PiPattern from "./pages/PiPattern/Pattern";
import PR from "./pages/PR/PR";
import PurchaseRequest from "./pages/PurchaseRequest/PurchaseRequest";
import SOA from "./pages/SOA";
import SurveyList from "./pages/Survey/SurveyList";
import Survey from "./pages/Survey";
import MarketReport from "./pages/MarketReport";
import MarketReportsList from "./pages/MarketReport/MarketReportsList";
import Loan from "./pages/Loan";
import EmploymentLetter from "./pages/EmploymentLetter";
import Contract from "./pages/Contract";
import Suggestion from "./pages/Suggestion";
import VoyageDates from "./pages/VoyageDates";
import VoyagesDatesDashboard from "./pages/VoyageDates/VoyagesDatesDashboard";
import User from "./pages/User";
import Ride from "./pages/Ride";
import EmployeeEvaluation from "./pages/EmployeeEvaluation";
import Evaluation from "./pages/EmployeeEvaluation/evaluation";
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
            <Route
              path="/users/:iduser/purchase_request/:idpurchaserequest"
              element={<PurchaseRequest />}
            />
            <Route
              path="/users/:iduser/purchase_request/new"
              element={<PurchaseRequest />}
            />
            <Route
              path="/users/:iduser/pi/:idpi/pi_pattern/new"
              element={<PiPattern />}
            />
            <Route
              path="/users/:iduser/pi/:idpi/pi_pattern/:idpipattern/duplicate"
              element={<PiPattern />}
            />
            <Route
              path="/users/:iduser/pi/:idpi/pi_pattern/:idpipattern"
              element={<PiPattern />}
            />
            <Route
              path="/users/:iduser/pi/:idpi/pi_pattern/:idpipattern/pi_print/new"
              element={<PiPattern />}
            />
            <Route
              path="/users/:iduser/pi/:idpi/pi_pattern/:idpipattern/pi_print/:idpiprint"
              element={<PiPattern />}
            />
            <Route path="/users/:iduser/pi/:idpi/soa" element={<SOA />} />
            <Route path="/users/:iduser/Survey" element={<SurveyList />} />
            <Route
              path="/users/:iduser/Survey/:idsurvey"
              element={<Survey />}
            />
            <Route
              path="/users/:iduser/market_report"
              element={<MarketReportsList />}
            />
            <Route
              path="/users/:iduser/market_report/:idmarketreport"
              element={<MarketReport />}
            />
            <Route path="/users/:iduser/loan/new" element={<Loan />} />
            <Route path="/users/:iduser/loan/:idloan" element={<Loan />} />
            <Route path="/users/:iduser/employmentletter/new" element={<EmploymentLetter />} />
            <Route path="/users/:iduser/employmentletter/:idemploymentletter" element={<EmploymentLetter />} />
            <Route path="/users/:iduser/employee_evaluation" element={<EmployeeEvaluation />} />
            <Route path="/users/:iduser/employee_evaluation/:idemployeeevaluationuser" element={<Evaluation />} />
            <Route path="/users/:iduser/contract/new" element={<Contract />} />
            <Route
              path="/users/:iduser/contract/:idcontract"
              element={<Contract />}
            />
            <Route
              path="/users/:iduser/suggestion/new/:suggestion_type"
              element={<Suggestion />}
            />
            <Route
              path="/users/:iduser/suggestion/:idsuggestion"
              element={<Suggestion />}
            />
            <Route
              path="/users/:iduser/voyage-dates/dashboard"
              element={<VoyagesDatesDashboard />}
            />
            <Route
              path="/users/:iduser/voyage-dates/idvoyage/:idvoyage/idcontract/:idcontract/voyageno/:voyageno/eta/:eta/vessel/:vessel"
              element={
                <VoyageDates idVoyage={195} vessel="Elkor" voyageNo={2} />
              }
            />
            <Route path="users/:idwinkart/profile" element={<User /> } />
            <Route path="/users/:iduser/rides/new" element={<Ride />} />
            <Route path="/users/:iduser/rides/:idride" element={<Ride />} />
            <Route path="*" element={<h1>404</h1>} />
          </Routes>
        </BrowserRouter>
      </AppContext.Provider>
    </div>
  );
}

export default App;
