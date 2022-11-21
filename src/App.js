import { useState } from "react";
// import FileUploader from "./components/FileUploader";
import MultiFileUploader from "./components/MultiFileUploader";

function App() {
  const defaultFiles = [];

  const [files, setFiles] = useState(defaultFiles);
  const handleFileUpdate = (files) => {
    setFiles(files);
  };

  return (
    <div className="App">
      <MultiFileUploader files={files} onChange={(f) => handleFileUpdate(f)} />
    </div>
  );
}

export default App;
