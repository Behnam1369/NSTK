import { useEffect, useState } from "react";
import { host } from "../../Utils/host";
import { useParams } from "react-router";
import style from "./index.module.scss";
import Pi from "./Pi";
import { useSearchParams } from "react-router-dom";

export default function SOA() {
  const [data, setData] = useState(null);
  const { iduser, idpi } = useParams();
  const [selectedPi, setSelectedPi] = useState(idpi);
  const [searchText, setSearchText] = useState("");
  const [searchParams] = useSearchParams();
  const tabno = searchParams.get("tabno");

  useEffect(() => {
    const loadData = async () => {
      await fetch(`${host}//users/${iduser}/pi/${idpi}/soa`)
        .then((res) => res.json())
        .then((d) => setData(d.result));

      window.parent.postMessage({ title: "loaded", tabno }, "*");
    };

    loadData();
  }, []);

  const handleSelectPi = (id) => {
    setSelectedPi(id);
  };

  return (
    <div className={style.main}>
      {!data && <h1>SOA</h1>}
      {data && (
        <>
          <div>
            <h3>{data[0].CustomerName}</h3>
            <input
              type="text"
              placeholder="Search ... "
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <ul>
              {data
                .filter((pi) =>
                  pi.PiNo.toLowerCase().includes(searchText.toLocaleLowerCase())
                )
                .map((pi) => (
                  <li
                    key={pi.IdPi}
                    className={pi.IdPi == selectedPi ? style.active : ""}
                    onClick={() => handleSelectPi(pi.IdPi)}
                  >
                    {pi.PiNo}
                  </li>
                ))}
            </ul>
          </div>
          <Pi data={data.find((pi) => pi.IdPi == selectedPi)} />
        </>
      )}
    </div>
  );
}
