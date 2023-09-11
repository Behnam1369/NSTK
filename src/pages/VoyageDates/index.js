import axios from "axios";
import { useEffect, useState } from "react";
import { host } from "../../Utils/host";
import Item from "./Item";
import style from "./index.module.scss";
import { useParams } from "react-router-dom";

export default function VoyageDates() {
  const { iduser } = useParams();

  const [items, setItems] = useState([]);

  const { idvoyage, idcontract, voyageno, eta, vessel } = useParams();

  useEffect(() => {
    const getDates = async () => {
      await axios
        .post(`${host}/voyage_dates/voyage_date_items`, {
          idvoyage,
          idcontract,
          voyageno,
          eta,
        })
        .then((res) => setItems(res.data));
      window.parent.postMessage({ title: "loaded" }, "*");
    };

    getDates();
  }, []);

  const increment = (idVoyageDateItem) => {
    axios
      .post(`${host}/users/${iduser}/voyage_dates/increment`, {
        idVoyageDateItem,
        idvoyage,
        idcontract,
        voyageno,
        eta
      })
      .then((res) => setItems(res.data));
  };

  const decrement = (idVoyageDateItem) => {
    axios
      .post(`${host}/users/${iduser}/voyage_dates/decrement`, {
        idVoyageDateItem,
        idvoyage,
        idcontract,
        voyageno,
        eta
      })
      .then((res) => setItems(res.data));
  };

  const register = (idVoyageDateItem) => {
    axios
      .post(`${host}/users/${iduser}/voyage_dates/register`, {
        idVoyageDateItem,
        idvoyage,
        idcontract,
        voyageno,
        eta,
      })
      .then((res) => setItems(res.data));
  };

  const clear = (idVoyageDateItem) => {
    axios
      .post(`${host}/users/${iduser}/voyage_dates/clear`, {
        idVoyageDateItem,
        idvoyage,
        idcontract,
        voyageno,
        eta,
      })
      .then((res) => setItems(res.data));
  };

  return (
    <div className={style.main}>
      <h1>{vessel + " (V" + voyageno + ")"}</h1>
      <div className={style.cards}>
        {items.map((item) => (
          <Item
            key={item.IdVoyageDateItem}
            title={item.Title}
            date={item.Date}
            dateType={item.DateType}
            onIncrement={() => increment(item.IdVoyageDateItem)}
            onDecrement={() => decrement(item.IdVoyageDateItem)}
            onRegister={() => register(item.IdVoyageDateItem)}
            onClear={() => clear(item.IdVoyageDateItem)}
          />
        ))}
      </div>
    </div>
  );
}
