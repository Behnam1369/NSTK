import { useEffect, useState } from "react";
import FileUploader from "./FileUploader";
import { v4 as uuidv4 } from "uuid";
import { BsTrash } from "react-icons/bs";
import style from "./MultiFileUploader.module.scss";

export default function MultiFileUploader(props) {
  const [files, setFiles] = useState([]);
  console.log(files);
  useEffect(() => {
    if (props.files.length === 0) {
      handleAddFile();
    }
    setFiles(
      props.files.map((file) => {
        return { ...file, id: uuidv4() };
      })
    );
  }, []);

  const handleFileUpdate = (f, id = null) => {
    if (files.length === 0) {
      setFiles([{ ...f, id: uuidv4() }]);
    } else {
      setFiles(files.map((file) => (file.id === id ? { ...f, id: id } : file)));
    }
    props.onChange(files);
  };

  const handleAddFile = (e) => {
    e.preventDefault();
    setFiles([
      ...files,
      {
        id: uuidv4(),
        IdAttachment: null,
        Title: null,
        Name: null,
        Size: null,
        UploadDate: null,
      },
    ]);
    props.onChange(files);
  };

  const handleDelete = (id) => {
    setFiles(files.filter((file) => file.id !== id));
    props.onChange(files);
  };

  return (
    <div>
      {files.length > 0 &&
        files.map((file) => (
          <div className={style.row}>
            <FileUploader
              key={file.id}
              file={file}
              onChange={(f) => handleFileUpdate(f, file.id)}
            />
            <BsTrash
              className={style.remove}
              title="Delete"
              onClick={() => handleDelete(file.id)}
            />
          </div>
        ))}
      <button className={style.add} onClick={(e) => handleAddFile(e)}>
        Add File
      </button>
    </div>
  );
}
