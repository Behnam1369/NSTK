import { useState } from "react";
import Datepicker from "./components/Datepicker";
// import FileUploader from "./components/FileUploader";
// import MultiFileUploader from "./components/MultiFileUploader";

function App() {
  const defaultFiles = [];

  const [files, setFiles] = useState(defaultFiles);
  const handleFileUpdate = (files) => {
    setFiles(files);
  };

  const [date, setDate] = useState("2022-11-23");
  console.log(date);

  return (
    <div className="App">
      {/* <MultiFileUploader files={files} onChange={(f) => handleFileUpdate(f)} /> */}
      <Datepicker
        calformat="jalali"
        name=""
        value={date}
        onChange={() => setDate}
      />
      <p>Behnam Aghaali is a wonderful programmer</p>
    </div>
  );
}

export default App;
