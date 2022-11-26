import { useEffect, useState } from "react";
import Selector from "./components/Selector";
import Datepicker from "./components/Datepicker";
import { loaded } from "./Utils/public";
// import FileUploader from "./components/FileUploader";
// import MultiFileUploader from "./components/MultiFileUploader";

const data = [
  { id: 1, title: "Iran" },
  { id: 2, title: "Ukraine" },
  { id: 3, title: "Spain" },
  { id: 4, title: "USA" },
  { id: 5, title: "Gabon" },
];

function App() {
  const defaultFiles = [];

  const [files, setFiles] = useState(defaultFiles);
  const handleFileUpdate = (files) => {
    setFiles(files);
  };

  const [date, setDate] = useState("2022-11-23");
  console.log(date);

  useEffect(() => {
    window.parent.postMessage("loaded", "*");
  }, []);

  return (
    <div className="App">
      {/* <MultiFileUploader files={files} onChange={(f) => handleFileUpdate(f)} /> */}
      <Datepicker
        calformat="jalali"
        name=""
        value={date}
        onChange={() => console.log(2)}
      />

      <Selector
        data={data}
        id="id"
        title="title"
        width={250}
        selectionChanged={() => console.log(1)}
      />
      <p>Behnam Aghaali is a wonderful programmer</p>
    </div>
  );
}

export default App;
