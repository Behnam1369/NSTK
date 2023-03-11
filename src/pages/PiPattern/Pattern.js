import { useRef, useState } from "react";
import PatternItem from "./PatternItem";
import style from "./Pattern.module.scss";

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

  const [items, setItems] = useState([
    {
      id: new Date().getTime(),
      title: "Reference",
      formula: "",
      text: "2 + 2 = {2 + 2} is it correct {1+5}",
    },
  ]);

  const changeText = (id, text) => {
    const newItems = items.map((el) => {
      if (el.id === id) {
        return { ...el, text };
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
        formula: "write your text here",
        text: "write your text here",
      },
      ...items.filter((el, ind) => ind > i),
    ]);
  };

  const handleInsertExpression = (txt, e) => {
    console.log(editingRef.current);
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

  return (
    <div className={style.main}>
      <div>
        <h1>PI Pattern</h1>

        {items.map((el, i) => (
          <PatternItem
            key={el.id}
            title={el.title}
            text={el.text}
            changeText={(t) => changeText(el.id, t)}
            changeTitle={(t) => {
              changeTitle(el.id, t);
            }}
            addItem={() => handleAddItem(i)}
            pi={pi}
            onEdit={() => handleEdit(el.id)}
            ref={el.id === editingItem ? editingRef : null}
            moveUp={() => moveUp(i)}
            moveDown={() => moveDown(i)}
          />
        ))}
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
    </div>
  );
}
