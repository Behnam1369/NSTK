import react, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { host } from "../Utils/host";
import { MdOutlineAttachFile, MdOutlineClear } from "react-icons/md";
import { fileSize } from "../Utils/public";
import style from "./FileUploader.module.scss";

export default function FileUploader(props) {
  const [progress, setProgress] = useState(0);
  const [uploadState, setUploadState] = useState("Empty");
  const [file, setFile] = useState(null);
  const fileInput = useRef();

  useEffect(() => {
    if (props.file) {
      setFile({
        name: props.file.Name,
        size: props.file.Size,
        title: props.file.Title,
      });
      setUploadState("Uploaded");
    }
  }, []);

  const uploadFile = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    setFile(file);

    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        setProgress(percent);
      },
    };

    setUploadState("Uploading");
    axios.post(`${host}/file`, formData, options).then((res) => {
      setUploadState("Uploaded");
      setFile({
        name: res.data.file.Name,
        size: res.data.file.Size,
        title: res.data.file.Title,
      });
      props.onChange({
        Name: res.data.file.Name,
        Size: res.data.file.Size,
        Title: res.data.file.Title,
      });
    });
  };

  const handleClick = (e) => {
    if (uploadState === "Empty") {
      fileInput.current.click();
    } else if (uploadState === "Uploaded") {
      let file_path =
        "https://portal.spii.co.com/uploads/" +
        file.name.replace(/[%$@#&*^()=!~ ]/g, "_");
      let a = document.createElement("A");
      a.href = file_path;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setFile(null);
    setUploadState("Empty");
    props.onChange(null);
  };

  return (
    <div
      className={`file-uploader ${style.div}`}
      onClick={(e) => handleClick(e)}
      style={
        uploadState === "Uploading"
          ? {
              cursor: "not-allowed",
              backgroundImage: `linear-gradient(to right, #dedede, #cbbdf8 ${progress}% , white ${
                progress + 1
              }%)`,
            }
          : uploadState === "Uploaded"
          ? { backgroundColor: "#cbbdf8" }
          : {}
      }
    >
      <input
        type="file"
        ref={fileInput}
        onChange={(e) => uploadFile(e)}
        style={{ display: "none" }}
      />
      {uploadState === "Empty" && (
        <p>
          Click to upload <MdOutlineAttachFile />{" "}
        </p>
      )}
      {uploadState === "Uploading" && (
        <p>
          Uploading file [
          {file.name.length > 30
            ? file.name.substring(0, 30) + "..."
            : file.name}
          ] - {progress}%
        </p>
      )}
      {uploadState === "Uploaded" && (
        <p className={style.uploaded}>
          <span title={file.name}>
            {file.name.length > 30
              ? file.name.substring(0, 30) + "..."
              : file.name}
            {<span style={{ color: "purple" }}> ({fileSize(file)})</span>}
          </span>
          <MdOutlineClear
            className={style.clear}
            title="Remove file"
            onClick={(e) => {
              handleClear(e);
            }}
          />
        </p>
      )}
    </div>
  );
}
