import { useEffect, useState, useRef } from "react";
import FileUploader from "./FileUploader";
import { v4 as uuidv4 } from "uuid";
import { BsTrash } from "react-icons/bs";
import style from "./MultiFileUploader.module.scss";

export default function MultiFileUploader(props) {
  const [idfiles, setIdfiles] = useState("");
  const btn = useRef(null);

  useEffect(() => {
    setIdfiles(props.idfiles.split(","));
    if (props.idfiles == "") setIdfiles([uuidv4()]);
  }, [props.idfiles]);

  const handleFileUpdate = (oldid, newid) => {
    const newIdFiles = idfiles.map((idfile) =>
      idfile === oldid ? newid : idfile
    );
    setIdfiles(newIdFiles);
    props.onChange(newIdFiles.join(","));
  };

  const handleAddFile = (e) => {
    e.preventDefault();
    setIdfiles([...idfiles, uuidv4()]);
    props.onChange([...idfiles, uuidv4()].join(","));
  };

  const handleDelete = (id) => {
    var newIdFiles = idfiles.filter((idfile) => idfile != id);
    setIdfiles(newIdFiles);
    props.onChange(newIdFiles.join(","));
  };

  return (
    <div dir="ltr" style={{ maxWidth: "530px", width: "100%" }}>
      {idfiles.length > 0 &&
        idfiles.map((idfile) => (
          <div className={style.row} key={idfile}>
            <FileUploader
              idfile={idfile}
              onChange={(newid) => handleFileUpdate(idfile, newid)}
            />
            <BsTrash
              className={style.remove}
              title="Delete"
              onClick={() => handleDelete(idfile)}
            />
          </div>
        ))}
      <button ref={btn} className={style.add} onClick={(e) => handleAddFile(e)}>
        Add File
      </button>
    </div>
  );
}
