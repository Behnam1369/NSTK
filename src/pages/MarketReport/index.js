import { useEffect, useState } from "react";
import { IoSaveOutline, IoTrashOutline } from "react-icons/io5";
import { useParams, useSearchParams } from "react-router-dom";
import style from "./index.module.scss";
import FormContainer from "../../components/FormContainer";
import Labels from "../../components/Labels";
import { host } from "../../Utils/host";
import Datepicker from "../../components/Datepicker";
import { shamsiDate } from "../../Utils/public";
import MultiFileUploader from "../../components/MultiFileUploader";
import axios from "axios";
import Message from "../../components/Message";

const defaultData = {
  IdMarketReport: "",
  Title: "",
  Product: "",
  Market: "",
  ReportDate: "",
  ReportDateShamsi: "",
  Note: "",
  IdFiles: "",
};

export default function MarketReport() {
  const { idmarketreport, iduser } = useParams();
  const [formState, setFormState] = useState("loading");
  const [data, setData] = useState(defaultData);
  const [marketSuggestions, setMarketSuggestions] = useState([]);
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [messageText, setMessageText] = useState(false);
  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");

  const handleSave = (e) => {
    e.preventDefault();
    setFormState("saving");
    if (data.IdMarketReport) {
      axios
        .patch(`${host}/users/${iduser}/market_report/${idmarketreport}`, data)
        .then((res) => {
          setMessageText("اطلاعات با موفقیت ذخیره شد");
          setData(res.data);
          setFormState("loaded");
        })
        .catch((error) => {
          setMessageText("خطا در ثبت اطلاعات");
          console.log(error);
          setFormState("loaded");
        });
    } else {
      axios
        .post(`${host}/users/${iduser}/market_report`, data)
        .then((res) => {
          setMessageText("اطلاعات با موفقیت ذخیره شد");
          setData(res.data);
          setFormState("loaded");
        })
        .catch((error) => {
          setMessageText("خطا در ثبت اطلاعات");
          console.log(error);
          setFormState("loaded");
        });
    }
  };

  const handleDelete = (e) => {
    setFormState("deleting");
    axios
      .delete(`${host}/users/${iduser}/market_report/${idmarketreport}`, data)
      .then((res) => {
        setMessageText("اطلاعات با موفقیت حذف شد");
        setData(defaultData);
        setFormState("loaded");
      })
      .catch((error) => {
        setMessageText("خطا در حذف اطلاعات");
        console.log(error);
        setFormState("loaded");
      });
  };

  const handleUpdate = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleMarketInput = (val) => {
    if (!val) {
      setMarketSuggestions([]);
    } else {
      fetch(`${host}/users/${iduser}/market_report/market_search/${val}`)
        .then((res) => res.json())
        .then((res) => {
          setMarketSuggestions(res);
        });
    }
  };

  const handleProductInput = (val) => {
    if (!val) {
      setProductSuggestions([]);
    } else {
      fetch(`${host}/users/${iduser}/market_report/product_search/${val}`)
        .then((res) => res.json())
        .then((res) => {
          setProductSuggestions(res);
        });
    }
  };

  const setDate = (val) => {
    setData({ ...data, ReportDate: val, ReportDateShamsi: shamsiDate(val) });
  };

  const handleUpdateLabels = (val, name) => {
    setData({ ...data, [name]: val });
  };

  useEffect(() => {
    const loadData = async () => {
      fetch(`${host}/users/${iduser}/market_report/${idmarketreport}`)
        .then((res) => res.json())
        .then((res) => setData(res));
    };

    if (idmarketreport > 0) {
      loadData();
    }

    window.parent.postMessage({ title: "loaded", tabno }, "*");
  }, []);

  const setFiles = (val) => {
    setData({ ...data, IdFiles: val });
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
        />
        <label>Markets: </label>
        <Labels
          values={data.Market}
          suggestions={marketSuggestions}
          onInput={(val) => handleMarketInput(val)}
          onChange={(val) => handleUpdateLabels(val, "Market")}
        />
        <label>Products: </label>
        <Labels
          values={data.Product}
          suggestions={productSuggestions}
          onInput={(val) => handleProductInput(val)}
          onChange={(val) => handleUpdateLabels(val, "Product")}
        />
        <label>Report Date: </label>
        <Datepicker
          value={data.ReportDate}
          onChange={(val) => setDate(val)}
          name="marketreport_reportdate"
        />
        <label>َAttachments: </label>
        <MultiFileUploader
          idfiles={data.IdFiles || ""}
          onChange={(idfiles) => setFiles(idfiles)}
        />
        <label>Note: </label>
        <textarea
          type="text"
          className={style.txt}
          value={data.Note || ""}
          style={{ width: "100%", height: "100px" }}
          name="Note"
          onChange={(e) => handleUpdate(e)}
        ></textarea>
      </FormContainer>
      {messageText && (
        <Message
          text={messageText}
          setShow={(result) => {
            setMessageText(result);
          }}
        />
      )}
    </div>
  );
}
