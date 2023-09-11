import style from "./Voyage.module.scss";
export default function Voyage({ data, hoveringCell, y, onMouseEnter }) {
  const { Vessel, VoyageNo, VoyageDates, IdContract, IdVoyage } = data;

  const currentDate = new Date().toISOString().split('T')[0];

  const OpenVoyageDates = () => {
    console.log('post message');
    window.parent.postMessage(
      {
        title: "voyage_dates",
        args: { 
          idvoyage: IdVoyage, 
          idcontract: IdContract, 
          voyageno: VoyageNo, 
          eta:  VoyageDates.find((date) => date.IdVoyageDateItem == 6 ).Date,
          vessel:Vessel 
        },
        tabTitle: "Voyage Dates - " + Vessel,
      },
      "*"
    );
  };

  return (
    <div className={style.row} onClick={() => OpenVoyageDates()}>
      <span style={{ padding: "0 5px" }} >
        <span onMouseEnter={() => onMouseEnter(0, y)}  >
          {Vessel} ({VoyageNo})
        </span>
        {y == hoveringCell[1] && <div className={`${style.hovering}`}></div>}
      </span>
      {VoyageDates.map((date, x) => (
        <span
          key={date.IdVoyageDateItem}
          title={date.Title}
          className={`
            ${style.cell}
            ${style[date.DateType]} 
            ${date.Title == "ETA Assaluyeh" ? style.eta : ""} 
            ${currentDate > date.Date && date.DateType == "Estimated" ? style.passed : ""}
          `}
          onMouseEnter={() => onMouseEnter(x, y)}
        >
          {date.Date.substring(5, 10)}
          {y == hoveringCell[1] && <div className={`${style.hovering}`}></div>}
          {x == hoveringCell[0] && <div className={`${style.hovering}`}></div>}
        </span>
      ))}
    </div>
  );
}
