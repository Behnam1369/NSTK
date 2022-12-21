import { useEffect, useState, useRef } from "react";
import FileUploader from "./FileUploader";
import { v4 as uuidv4 } from "uuid";
import { BsTrash } from "react-icons/bs";
import style from "./MultiFileUploader.module.scss";

export default function MultiFileUploader(props) {
  const [files, setFiles] = useState(props.files);
  const btn = useRef(null);

  useEffect(() => {
    if (props.files.length === 0) {
      let newFiles = [
        {
          id: uuidv4(),
          IdAttachment: null,
          Title: null,
          Name: null,
          Size: null,
          UploadDate: null,
        },
      ];
      setFiles(newFiles);
    } else {
      setFiles(
        props.files.map((file) => ({
          ...file,
          id: uuidv4(),
        }))
      );
    }
  }, [props.files]);

  const handleFileUpdate = (f, id = null) => {
    let newFiles;
    if (f == null) {
      newFiles = files.map((file) =>
        file.id === id
          ? {
              id: uuidv4(),
              IdAttachment: null,
              Title: null,
              Name: null,
              Size: null,
              UploadDate: null,
            }
          : file
      );
    } else {
      newFiles = files.map((file) =>
        file.id === id ? { ...file, ...f } : file
      );
    }
    setFiles(newFiles);
    props.onChange(newFiles);
  };

  const handleAddFile = (e) => {
    e.preventDefault();
    let newFiles = [
      ...files,
      {
        id: uuidv4(),
        IdAttachment: null,
        Title: null,
        Name: null,
        Size: null,
        UploadDate: null,
      },
    ];
    setFiles(newFiles);
    props.onChange(newFiles);
  };

  const handleDelete = (id) => {
    let newFiles = files.filter((file) => file.id !== id);
    setFiles(newFiles);
    props.onChange(newFiles);
  };

  return (
    <div dir="ltr" style={{ maxWidth: "530px", width: "100%" }}>
      {files.length > 0 &&
        files.map((file) => (
          <div className={style.row} key={file.id}>
            <FileUploader
              file={file}
              key={file.id}
              onChange={(f) => handleFileUpdate(f, file.id)}
            />
            <BsTrash
              className={style.remove}
              title="Delete"
              key={"btnDelete" + file.id}
              onClick={() => handleDelete(file.id)}
            />
          </div>
        ))}
      <button ref={btn} className={style.add} onClick={(e) => handleAddFile(e)}>
        Add File
      </button>
    </div>
  );
}
