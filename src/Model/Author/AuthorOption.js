import React, { useState, useEffect } from "react";
import _ from "lodash";
import "components/Common/Antd.css";
import { List, Card, Collapse } from "antd";
import PieChart from "Model/Chart/antv/PieChart";
import BarChart from "Model/Chart/antv/BarChart";
import LineChart from "Model/Chart/antv/LineChart";
import ColumnChart from "Model/Chart/antv/ColumnChart";
import BoxPlot from "Model/Chart/antv/BoxPlot";
import ScatterPlot from "Model/Chart/antv/ScatterPlot";
import AreaChart from "Model/Chart/antv/AreaChart";
import Options from "Model/Chart/antv/OptionArray";

const { Panel } = Collapse;

const ChartOption = (props) => {
  useEffect(() => {
    setDataSource(Options[props.type]);
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
      selected.push(item.key);
      setSelected(selected);
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
  let originfig = {
    data: config.data,
    xField: config.xField,
    yField: config.yField,
  };
  if (config.seriesField)
    originfig = { ...originfig, seriesField: config.seriesField };
  if (config.colorField)
    originfig = { ...originfig, colorField: config.colorField };
  if (config.sizeField)
    originfig = { ...originfig, sizeField: config.sizeField };

  originfig = { ...originfig, height: 90, autoFit: true, ...option };

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