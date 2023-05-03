import { useEffect, useState } from "react";
import style from "./MarketReportsList.module.scss";
import axios from "axios";
import { host } from "../../Utils/host";
import { useParams } from "react-router-dom";

export default function MarketReportsList() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const { iduser } = useParams();

  const loadDate = async (searchText) => {
    searchText = searchText.replace(/ /g, "");
    axios
      .get(
        `${host}/users/${iduser}/market_report/search/${searchText || "all"}`
      )
      .then((res) => setData(res.data));
  };

  useEffect(() => {
    loadDate(search);
  }, [iduser, search]);

  const OpenReport = (id) => {
    console.log(id);
  };

  const handleTagClick = (e, val) => {
    e.stopPropagation();
    setSearch(val);
    loadDate(val);
  };

  return (
    <div className={style.main}>
      <div className={style.header}>
        <h1>List of reports ({data.length}) </h1>
        <input
          type="text"
          value={search}
          placeholder="Search in title, market or product ... "
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className={style.cards}>
        {data.map((card) => (
          <div
            key={card.IdMarketReport}
            className={style.card}
            onClick={() => OpenReport(card.IdMarketReport)}
          >
            <h3>{card.Title}</h3>
            <ul className={style.markets}>
              {card.Market.split(",").map((market) => (
                <li
                  className={style.market}
                  onClick={(e) => handleTagClick(e, market)}
                >
                  {market}
                </li>
              ))}
            </ul>
            <ul className={style.products}>
              {card.Product.split(",").map((product) => (
                <li
                  className={style.product}
                  onClick={(e) => handleTagClick(e, product)}
                >
                  {product}
                </li>
              ))}
            </ul>
            <p>
              Report Date: {card.ReportDate} ({card.ReportDateShamsi})
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
