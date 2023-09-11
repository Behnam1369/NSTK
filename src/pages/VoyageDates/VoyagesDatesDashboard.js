import axios from "axios";
import { useEffect, useState } from "react";
import { host } from "../../Utils/host";
import Voyage from "./Voyage";
import style from "./VoyagesDatesDashboard.module.scss";

export default function VoyagesDatesDashboard() {
  const [voyages, setVoyages] = useState([]);
  const [hoveringCell, setHoveringCell] = useState([-1, -1]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`${host}/voyage_dates/voyages_dates`)
      .then((res) => setVoyages(res.data));
    window.parent.postMessage({ title: "loaded" }, "*");
  };

  const headers =
    voyages.length > 0
      ? Object.values(voyages[0].VoyageDates).map((el) => el.Title)
      : [];

  const handleMouseEnter = (x, y) => {
    setHoveringCell([x, y]);
  };

  return (
    <div className={style.main}>
      <h2>List of voyages </h2>
      <div>
        <div className={style.row}>
          <span className={style.header} style={{ padding: "0 5px" }}>
            Vessel
          </span>
          {headers.map((title, index) => (
            <span key={index} title={title} className={style.header} onMouseEnter={() => handleMouseEnter(index , 1)}>
              {title}
              {index == hoveringCell[0] && (
                <div className={`${style.hovering}`}></div>
              )}
            </span>
          ))}
        </div>
        {voyages.map((voyage) => (
          <Voyage
            key={voyage.Row}
            data={voyage}
            y={voyage.Row}
            hoveringCell={hoveringCell}
            onMouseEnter={(x, y) => handleMouseEnter(x, y)}
          />
        ))}
      </div>
    </div>
  );
}
