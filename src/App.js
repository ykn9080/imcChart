import React from "react";
import "./App.css";
import EasyChart from "./Chart/EasyChart";

const App = () => {
  return (
    <div style={{ flexGrow: 1 }}>
      <EasyChart edit={true} authObj={sampledata} />
    </div>
  );
};

export default App;

const sampledata = {
  checked: true,
  h: 22,
  i: "4",
  setting: {
    title: "new Item5",
    charttype: "pie",
    xField: "Year",
    yField: "Population",
    aggregate: "sum",
    series: "Slug Nation",
    initVal: {
      url: "https://datausa.io/api/data?drilldowns=Nation&measures=Population",
      method: "get",
      header: "",
      datafield: "data",
    },
    result: [
      {
        "ID Nation": "01000US",
        Nation: "United States",
        "ID Year": 2019,
        Year: "2019",
        Population: 328239523,
        "Slug Nation": "united-states",
      },
      {
        "ID Nation": "01000US",
        Nation: "United States",
        "ID Year": 2018,
        Year: "2018",
        Population: 327167439,
        "Slug Nation": "united-states",
      },
      {
        "ID Nation": "01000US",
        Nation: "United States",
        "ID Year": 2017,
        Year: "2017",
        Population: 325719178,
        "Slug Nation": "united-states",
      },
      {
        "ID Nation": "01000US",
        Nation: "United States",
        "ID Year": 2016,
        Year: "2016",
        Population: 323127515,
        "Slug Nation": "united-states",
      },
      {
        "ID Nation": "01000US",
        Nation: "United States",
        "ID Year": 2015,
        Year: "2015",
        Population: 321418821,
        "Slug Nation": "united-states",
      },
      {
        "ID Nation": "01000US",
        Nation: "United States",
        "ID Year": 2014,
        Year: "2014",
        Population: 318857056,
        "Slug Nation": "united-states",
      },
      {
        "ID Nation": "01000US",
        Nation: "United States",
        "ID Year": 2013,
        Year: "2013",
        Population: 316128839,
        "Slug Nation": "united-states",
      },
    ],
  },
  type: "chart",
  w: 6,
  x: 6,
  y: 22,
  dtlist: [
    { Year: "2019", Population: 328239523 },
    { Year: "2018", Population: 327167439 },
    { Year: "2017", Population: 325719178 },
    { Year: "2016", Population: 323127515 },
    { Year: "2015", Population: 321418821 },
    { Year: "2014", Population: 318857056 },
    { Year: "2013", Population: 316128839 },
  ],
};
