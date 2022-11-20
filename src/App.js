import { useState } from "react";
import FileUploader from "./components/FileUploader";

function App() {
  const defaultFile = {
    IdAttachment: 21025,
    Title: "",
    Name: "uf21025_PR-401-0230__1401-08-23_Darkhast_pardakht_-_IRISL__-_Keshtirani_jomhoori_eslami_iran_-_Hazine_haml.pdf",
    Size: 1500,
    UploadDate: "",
  };
  const [file, setFile] = useState(defaultFile);
  console.log(file);
  const handleFileUpdate = (file) => {
    setFile(file);
  };

  return (
    <div className="App">
      <FileUploader file={file} onChange={(f) => handleFileUpdate(f)} />
    </div>
  );
}

export default App;
