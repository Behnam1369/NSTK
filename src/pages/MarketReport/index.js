import { useState } from "react";
import { IoSaveOutline, IoTrashOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import style from "./index.module.scss";
import FormContainer from "../../components/FormContainer";
import Labels from "../../components/Labels";
import { host } from "../../Utils/host";

const defaultData = {};

export default function MarketReport() {
  const { idmarketreport, iduser } = useParams();
  const [formState, setFormState] = useState("loading");
  const [data, setData] = useState(defaultData);
  const [marketSuggestions, setMarketSuggestions] = useState([]);

  const handleSave = (e) => {};

  const handleDelete = (e) => {};

  const handleUpdate = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleMarketInput = (val) => {
    if (!val) {
      setMarketSuggestions([]);
    } else {
      console.log(val);
      fetch(`${host}/users/${iduser}/market_report/market_search/${val}`)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          setMarketSuggestions(res);
        });
    }
  };

  return (
    <div>
      <div className={`${style.operationButtons}`} dir="rtl">
        <button
          className={`${style.operationButton}`}
          disabled={formState == "saving"}
          onClick={(e) => handleSave(e)}
        >
          <IoSaveOutline />
          <span>{formState == "saving" ? "درحال ذخیره" : "ذخیره"}</span>
        </button>
        <button
          className={`${style.operationButton}`}
          disabled={formState == "deleting"}
          onClick={(e) => handleDelete(e)}
        >
          <IoTrashOutline />
          <span>{formState == "deleting" ? "درحال خذف" : "حذف"}</span>
        </button>
      </div>
      <FormContainer>
        <label>Report ID:</label>
        <span>{data.IdMarketReport}</span>
        <label>Report Title: </label>
        <input
          type="text"
          className={style.txt}
          name="Title"
          value={data.Title}
          onChange={(e) => handleUpdate(e)}
          autoComplete="off"
          style={{ maxWidth: "580px" }}
        />
        <label>Markets: </label>
        <Labels
          values={["alex", "jeff"]}
          suggestions={marketSuggestions}
          onInput={(val) => handleMarketInput(val)}
        />
      </FormContainer>
    </div>
  );
}
