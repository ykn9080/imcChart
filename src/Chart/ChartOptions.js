import React, { useState, useEffect } from "react";
import "./components/Common/Antd.css";
import { List, Card, Collapse } from "antd";
import PieChart from "./ChartTools/antv/PieChart";
import BarChart from "./ChartTools/antv/BarChart";
import LineChart from "./ChartTools/antv/LineChart";
import ColumnChart from "./ChartTools/antv/ColumnChart";
import ScatterPlot from "./ChartTools/antv/ScatterPlot";
import AreaChart from "./ChartTools/antv/AreaChart";
import Options from "./ChartTools/antv/OptionArray";
import { CleanupObj } from "./EasyChart";

const { Panel } = Collapse;

const ChartOption = (props) => {
  useEffect(() => {
    setDataSource(Options[props.type]);
    setSelected([]);
  }, [props.type]);

  const [dataSource, setDataSource] = useState();
  const [selected, setSelected] = useState([]);

  const onCardClick = (item) => {
    if (selected.indexOf(item.key) > -1) {
      const indx = selected.indexOf(item.key);
      const nsel = selected.splice(indx);
      setSelected(nsel);
      props.onOptionClick(null);
    } else {
      setSelected([item.key]);
      props.onOptionClick(item.option);
    }
  };
  return (
    <>
      <Collapse defaultActiveKey={["1"]} ghost>
        <Panel header="Options" key="1">
          {dataSource && (
            <List
              grid={{ gutter: 16, column: 6 }}
              dataSource={dataSource}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    style={{
                      border:
                        selected && selected.indexOf(item.key) > -1
                          ? "1px solid #3994F7"
                          : "1px solid #d8d4d4",
                      borderRadius: 5,
                    }}
                    hoverable
                    onClick={() => onCardClick(item)}
                    cover={
                      <div style={{ padding: 15 }}>
                        {FindChart(props.type, props.config, item.option)}
                      </div>
                    }
                  ></Card>
                </List.Item>
              )}
            />
          )}
        </Panel>
      </Collapse>
    </>
  );
};
const FindChart = (type, config, option) => {
  if (!config) return null;

  if (!(config.data && config.data.length > 0)) return null;
  let originfig = {
    data: config.data,
    xField: config.xField,
    yField: config.yField,
  };
  [
    "xField",
    "yField",
    "seriesField",
    "colorField",
    "angleField",
    "sizeField",
  ].map((k, i) => {
    if (config[k]) originfig = { ...originfig, [k]: config[k] };
    return null;
  });

  originfig = { ...originfig, ...option, height: 100 };
  originfig = CleanupObj(originfig);
  console.log(originfig);
  switch (type) {
    case "pie":
      return <PieChart config={originfig} />;
    case "line":
      return <LineChart config={originfig} />;
    case "area":
      return <AreaChart config={originfig} />;
    case "column":
      return <ColumnChart config={originfig} />;
    case "bar":
      return <BarChart config={originfig} />;
    case "scatter":
      return <ScatterPlot config={originfig} />;
    default:
      return null;
  }
};
export default ChartOption;
