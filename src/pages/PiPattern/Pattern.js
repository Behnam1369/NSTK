import { useRef, useState, useEffect } from "react";
import PatternItem from "./PatternItem";
import style from "./Pattern.module.scss";
import { host } from "../../Utils/host";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { IoSaveOutline } from "react-icons/io5";
import Message from "../../components/Message";

const defaultPi = {
  IdPI: 500650,
  No: 237,
  PiNo: "SP/400/75/237",
  IdYear: 1401,
  IdCustomer: 300115,
  PiDate: "2022-02-01",
  Ref: "40054",
  IdCur: 1,
  IdDeliveryTerm: 612004,
  DestinationCountry: 620013,
  ProvisionalAmount: 1.925e5,
  AdvanceRate: 1.0e2,
  AdvanceDueDate: "2022-02-07",
  IdTrusteeAccount: 101080,
  IdBankAccountDetail: "1192",
  IdVessel: 0,
  SecondDischargePort: 0.0,
  BerthShifting: 0.0,
  LayTime: 0.0,
  Demurrage: 0.0,
  IdWorkFlow: 3,
  IdStep: 9,
  VchType: "Polymer",
  IdCustomer2: 300116,
  IdFormula: 999999,
  DelayRate: false,
  IdFormulaDestination: 0,
  ExpireDate: "2022-02-02",
  IdPort: 0,
  Payable: 1.925e5,
  Settled: 1.92500004084e5,
  Remained: -4.084000014699996e-3,
  Rate: 1.1156,
  RateDate: "2022-01-31",
  IdPaymentCur: 2,
  IdVch: 10023295,
  VchNo: 4,
  SaleType: 1,
  FinalSettlementOpportunity: 0,
  FinalSettlementBase: 0,
  IdPriceFormula: 0.0,
  DestinationString: '[{"idcountry":"620013","idport":[""]}]',
  PiDateShamsi: "1400/11/12",
  BulkLoad: false,
  Destination: "Turkey",
  Qty: 1.54e2,
  Issuer: "abbasi",
  Customer1: "HUZUR PLASTIK KIM MAD ITH IHR SAN VE TIC LTD STI",
  Customer2: "SELFPLAST PLASTIK AMBALAJ SAN DIS TIC LTD STI",
  DeliveryTerm: "FCA",
  Workflow: "پلیمر",
  Step: "کارشناس بازرگانی 1",
};

export default function PiPattern() {
  const [pi, setPi] = useState(defaultPi);
  const [searchField, setSearchField] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const editingRef = useRef();
  const [title, setTitle] = useState("New Pattern");
  const [messageText, setMessageText] = useState(false);

  let { iduser, idpi } = useParams();
  const [idpipattern, setIdpipattern] = useState(useParams().idpipattern);
  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");
  const [thirdParty, setThirdParty] = useState(1);

  const [items, setItems] = useState([
    {
      id: new Date().getTime(),
      title: "Reference",
      formula: "2 + 2 = {2 + 2} is it correct {1+5} ",
      text: "2 + 2 = 4 is it correct 6 ",
    },
  ]);

  useEffect(() => {
    if (!idpipattern)
      window.parent.postMessage({ title: "loaded", tabno }, "*");
    const loadData = async () => {
      await axios
        .get(`${host}/users/${iduser}/pi/${idpi}/pi_pattern/${idpipattern}`)
        .then((res) => {
          // console.log(JSON.parse(res.data.result[0].PiPatternItm));
          setPi(JSON.parse(res.data.result[0].Pi)[0]);
          setTitle(JSON.parse(res.data.result[0].PiPattern)[0].Title);
          setItems(
            JSON.parse(res.data.result[0].PiPatternItm).map((el) => {
              return {
                id: el.IdPiPatternItm,
                title: el.Title,
                formula: el.Formula,
                text: el.Text,
              };
            })
          );
          setThirdParty(JSON.parse(res.data.result[0].PiPattern)[0].ThirdParty);
        });
    };
    loadData();
    window.parent.postMessage({ title: "loaded", tabno }, "*");
  }, []);

  const handleChangeFormula = (id, f, t) => {
    const newItems = items.map((el) => {
      if (el.id === id) {
        return { ...el, formula: f, text: t };
      }
      return el;
    });
    setItems(newItems);
  };

  const changeTitle = (id, e) => {
    const newItems = items.map((el) => {
      if (el.id === id) {
        return { ...el, title: e.target.value };
      }
      return el;
    });
    setItems(newItems);
  };

  const handleSearch = (e) => {
    setSearchField(e.target.value);
  };

  const handleAddItem = (i) => {
    setItems([
      ...items.filter((el, ind) => ind <= i),
      {
        id: new Date().getTime(),
        title: "",
        formula: "<p></p>",
        text: "",
        type: "normal",
      },
      ...items.filter((el, ind) => ind > i),
    ]);
  };

  const handleInsertExpression = (txt, e) => {
    e.preventDefault();
    editingRef.current.handleInsertExpression(txt);
  };

  const handleEdit = (id) => {
    setEditingItem(id);
  };

  const moveUp = (index) => {
    if (index > 0)
      setItems([
        ...items.map((item, i) => {
          if (i === index - 1) {
            return items[index];
          } else if (i === index) {
            return items[index - 1];
          }
          return item;
        }),
      ]);
  };
  const moveDown = (index) => {
    if (index < items.length - 1)
      setItems([
        ...items.map((item, i) => {
          if (i === index + 1) {
            return items[index];
          } else if (i === index) {
            return items[index + 1];
          }
          return item;
        }),
      ]);
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    if (!idpipattern) {
      await axios
        .post(`${host}/users/${1}/pi_pattern`, {
          VchType: pi.VchType,
          Title: title,
          ThirdParty: thirdParty,
          pi_pattern_itms_attributes: items.map((el) => {
            return {
              Title: el.title,
              Formula: el.formula,
              Text: el.text,
              Type: el.type,
            };
          }),
        })
        .then((res) => {
          setSaving(false);
          setIdpipattern(res.data.data.IdPiPattern);
          setMessageText("اطلاعات با موفقیت ذخیره شد");
        })
        .catch((err) => {
          console.log(err);
          setSaving(false);
          setMessageText("خطا در ثبت اطلاعات");
        });
    } else {
      await axios
        .patch(`${host}/users/${1}/pi_pattern/${idpipattern}`, {
          VchType: pi.VchType,
          Title: title,
          ThirdParty: thirdParty,
          pi_pattern_itms_attributes: items.map((el) => {
            return {
              Title: el.title,
              Formula: el.formula,
              Text: el.text,
              Type: el.type,
            };
          }),
        })
        .then((res) => {
          setSaving(false);
          setIdpipattern(res.data.data.IdPiPattern);
          setMessageText("اطلاعات با موفقیت ذخیره شد");
        })
        .catch((err) => {
          setSaving(false);
          setMessageText("خطا در ثبت اطلاعات");
        });
    }
  };

  const changeType = (id, type) => {
    setItems([
      ...items.map((el) => {
        if (el.id === id) {
          return { ...el, type };
        }
        return el;
      }),
    ]);
  };

  const handleThirdPartyChange = (e) => {
    setThirdParty(e.target.value);
  };
  console.log(`third party: `, thirdParty);
  return (
    <div className={style.main}>
      <div>
        <div>
          <input
            type="text"
            className={style.title}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div>
            <label className={thirdParty == 0 ? style.selected : ""}>
              <input
                type="radio"
                value="0"
                name="thirdParty"
                onChange={(e) => handleThirdPartyChange(e)}
              />
              SPII
            </label>
            <label className={thirdParty == 1 ? style.selected : ""}>
              <input
                type="radio"
                value="1"
                name="thirdParty"
                onChange={(e) => handleThirdPartyChange(e)}
              />
              Third Party
            </label>
          </div>
        </div>
        {items.map((el, i) => (
          <PatternItem
            key={el.id}
            title={el.title}
            formula={el.formula}
            changeFormula={(f, t) => handleChangeFormula(el.id, f, t)}
            changeTitle={(t) => {
              changeTitle(el.id, t);
            }}
            addItem={() => handleAddItem(i)}
            pi={pi}
            onEdit={() => handleEdit(el.id)}
            ref={el.id === editingItem ? editingRef : null}
            moveUp={() => moveUp(i)}
            moveDown={() => moveDown(i)}
            changeType={(type) => changeType(el.id, type)}
            index={i}
          />
        ))}
        <div>
          <button
            className={`${style.formButton} ${style.saveButton}`}
            disabled={saving}
            onClick={(e) => handleSave(e)}
          >
            <IoSaveOutline />
            <span>{saving ? "درحال ذخیره" : "ذخیره"}</span>
          </button>
        </div>
      </div>
      <div>
        <input
          type="text"
          className={style.searchField}
          vlaue={searchField}
          onChange={(e) => handleSearch(e)}
        />
        <ul>
          {Object.keys(pi)
            .filter((el) =>
              el.toLowerCase().includes(searchField.toLowerCase())
            )
            .map((el) => (
              <li
                key={el}
                title={pi[el]}
                className={style.field}
                onClick={(e) => handleInsertExpression("pi." + el, e)}
              >
                {el}
              </li>
            ))}
        </ul>
      </div>
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
