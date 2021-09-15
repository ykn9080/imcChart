import React, { useState, useEffect } from "react";
import _ from "lodash";
import "./components/Common/Antd.css";
import axios from "axios";
import {
  Typography,
  Row,
  Col,
  Tabs,
  Divider,
  Table,
  Button,
  Input,
  Form,
  Tooltip,
  Spin,
} from "antd";
import { RedoOutlined } from "@ant-design/icons";
import AntFormDisplay from "imcformbuilder";
import formdt from "./AntFormDisplay.json";
// import Dataget from "Model/Author/Dataget";
import PieChart from "./ChartTools/antv/PieChart";
import BarChart from "./ChartTools/antv/BarChart";
import LineChart from "./ChartTools/antv/LineChart";
import ColumnChart from "./ChartTools/antv/ColumnChart";
import BoxPlot from "./ChartTools/antv/BoxPlot";
import ScatterPlot from "./ChartTools/antv/ScatterPlot";
import MatrixDiagram from "./ChartTools/antv/MatrixDiagram";
import AreaChart from "./ChartTools/antv/AreaChart";
import Treemap from "./ChartTools/d3/Treemap";
import treemapdata from "./ChartTools/d3/treemapData";
import ChartOption from "./ChartOptions";
import styled, { css } from "styled-components";

const { Title } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const formArray = formdt["5f1a590712d3bf549d18e583"];

const EasyChart = ({ authObj, edit, errorurl }) => {
  const [form] = Form.useForm();

  const [data, setData] = useState();
  const [dtsrc, setDtsrc] = useState();
  const [nodelist, setNodelist] = useState();
  const [filterlist, setFilterlist] = useState();
  const [setting1, setSetting1] = useState();
  const [patch, setPatch] = useState();
  const [initChart, setInitChart] = useState();
  const [config, setConfig] = useState();
  const [chartOpt, setChartOpt] = useState("");
  const [charttypeopt, setCharttypeopt] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.removeItem("modelchart");
  }, []);
  useEffect(() => {
    console.log(authObj);
    if (authObj) {
      setLoading(true);
      setData(authObj);
      if (authObj.dtlist) {
        setNodelist(authObj.dtlist);
        aggre();

        //AntFormDisplay dropdown patchlist make
        if (authObj.dtlist.length > 0) makeOptionArray(authObj.dtlist[0]);
      }
      if (authObj.setting) {
        const ds = authObj.setting;
        localStorage.setItem("modelchart", JSON.stringify(authObj));
        setSetting1(ds);
        setCharttypeopt(ds.charttype);
        //AntFormDisplay init
        setInitChart(ds); //initialValues
        if (ds.patchlist) setPatch(ds.patchlist); //Dropdown patchlist

        //dataget init
        let src = {};
        if (ds.initVal) src.initVal = ds.initVal;
        if (ds.result) {
          src.result = orderByX(ds.result, ds.xField);
        }
        setDtsrc(src);

        //config textarea init
        if (ds.options) {
          const optt = JSON.stringify(ds.options, null, 4);
          setChartOpt(optt);

          form.setFieldsValue({
            textarea: optt,
          });
        }
      } else {
        setInitChart({});
      }
      if (authObj.dtsrc) setDtsrc(authObj.dtsrc);
      setLoading(false);
    }
    //if (setting1 && setting1.value && setting1.charttype) chartchart(setting1);
    // setTimeout(() => {
    //   $(".ant-row.ant-form-item").css("margin-bottom", 1);
    // }, 500);
  }, [authObj]);
  const orderByX = (data, xfield) => {
    return _.sortBy(data, xfield);
  };
  useEffect(() => {
    // if (setting1 && setting1.yField && setting1.aggregate) aggre();
    // else if (setting1) chartchart(setting1);

    if (setting1 && nodelist) aggre();
  }, [setting1]);

  const makeOptionArray = (obj) => {
    let oparr = [{ value: "n/a", text: "n/a" }];

    Object.keys(obj).map((k, i) => {
      oparr.push({ value: k, text: k.charAt(0).toUpperCase() + k.slice(1) });
      return null;
    });

    let flist = [];
    let noDataOption = _.filter(formArray.list, (o) => {
      return (
        (o.type.indexOf("select") > -1) |
          (o.type.indexOf("checkbox") > -1) |
          (o.type.indexOf("radio") > -1) && !o.optionArray
      );
    });
    noDataOption.map((k) => {
      flist.push({ name: k.name, optionArray: oparr });
      return null;
    });

    setPatch(flist);
  };
  const aggre = () => {
    if (!setting1) return false;
    let listx = [],
      xlist = [],
      x = setting1.xField,
      val = setting1.yField;
    //x uniq list
    nodelist.map((dt) => xlist.push(_.pick(dt, x)[x]));
    xlist = _.uniq(xlist);
    if (setting1.aggregate && setting1.aggregate !== "n/a")
      xlist.map((k, i) => {
        const listbyx = _.filter(nodelist, (o) => {
          return o[x] === k;
        });
        let obj = { [x]: k };

        // val.map((v, i) => {
        let sum = _.sumBy(listbyx, val);
        //if (typeof sum !== "int") sum = sum.toFixed(2);
        let avg = _.meanBy(listbyx, val).toFixed(2);
        let count = listbyx.length;

        switch (setting1.aggregate) {
          case "sum":
            obj[val] = sum;
            break;
          case "average":
            obj[val] = avg; //parseFloat(sum / count);
            break;
          case "count":
            obj[val] = count;
            break;
          default:
            break;
        }
        // });
        listx.push(obj);
        return null;
      });
    else listx = nodelist;
    setFilterlist(listx);
    //setNodelist(listx);

    chartchart(setting1, listx);
  };

  const onValuesChangeTable1 = (changedValues, allValues) => {
    //allValues = cleanupObj(changedValues, allValues);
    let set2 = {};
    if (setting1) set2 = { ...setting1 };
    set2 = { ...set2, ...changedValues };
    set2 = CleanupObj(set2);
    if (changedValues.charttype) {
      setCharttypeopt(null);
      setTimeout(function () {
        setCharttypeopt(set2.charttype);
        updateLocalStorage("modelchart", {});
      }, 0);
    }
    console.log(changedValues);
    if (["title", "desc"].indexOf(Object.keys(changedValues)[0]) === -1)
      setSetting1(set2);

    //use localstorage to prevent state change
    let local = {},
      local1 = localStorage.getItem("modelchart");
    if (local1) local = JSON.parse(local1);
    local.setting = { ...local.setting, ...changedValues };
    localStorage.setItem("modelchart", JSON.stringify(local));
  };

  // chart Data conversion
  const chartOrigin = (allValues) => {
    //if (allValues) setting1 = allValues;
    if (!(setting1 && setting1?.yField)) return false;
    const x = setting1.xField;
    const val = setting1.yField;
    let newlist1 = filterlist;
    const newlist = _.sortBy(newlist1, x);

    let conf = { data: newlist };
    switch (setting1.charttype) {
      default:
        return;
      case "pie":
        conf = { ...conf, angleField: val, colorField: x };
        break;
      case "line":
      case "area":
      case "column":
        conf = { ...conf, yField: val, xField: x };
        if (setting1.series) conf = { ...conf, seriesField: setting1.series };
        break;

      case "bar":
        conf = { ...conf, yField: x, xField: val };
        if (setting1.series) conf = { ...conf, seriesField: setting1.series };
        break;
      case "scatterr":
        conf = { ...conf, yField: x, xField: val };
        break;
    }

    return conf;
  };

  const chartchart = (setting, newlist) => {
    if (!newlist) newlist = filterlist;
    if (!setting | !setting.yField) return false;
    const x = setting.xField;
    const val = setting.yField;
    const series = setting.series;
    const color = setting.colorField;
    const size = setting.sizeField;
    newlist = _.sortBy(newlist, x);

    let conf = { data: newlist };
    if (setting.options) conf = { ...conf, ...setting.options };
    switch (setting.charttype) {
      default:
        return;
      case "pie":
        conf = { ...conf, angleField: val, colorField: x };

        break;
      case "line":
      case "area":
      case "column":
        conf = { ...conf, yField: val, xField: x };
        if (series) conf = { ...conf, seriesField: series };
        break;
      case "bar":
        conf = { ...conf, yField: x, xField: val };
        if (series) conf = { ...conf, seriesField: series };
        break;
      case "scatter":
        conf = { ...conf, yField: val, xField: x };
        if (series) conf = { ...conf, seriesField: series };
        if (color) conf = { ...conf, colorField: color };
        if (size) conf = { ...conf, sizeField: size };
        break;
    }
    //const conf1 = cleanupObj(conf);

    if (val) setConfig(conf);
  };

  const onDataGet = (val) => {
    setFilterlist(val);
    setNodelist(val);
    if (val.length > 0) makeOptionArray(val[0]);
  };

  const onOptionClick = (opt) => {
    console.log("here", opt);
    let optt = " ";
    let settingg = { ...setting1 };
    const chart1 = setting1.charttype;
    if (opt) optt = JSON.stringify(opt, null, 4);
    if (optt === " ") {
      setSetting1({ ...settingg, charttype: null });
    }
    form.setFieldsValue({
      textarea: optt,
    });
    setChartOpt(optt);
    updateLocalStorage("modelchart", { options: opt });
    setConfig({ ...chartOrigin(), ...opt });
    setTimeout(function () {
      setSetting1({ ...setting1, charttype: chart1 });
    }, 100);
  };
  const reloadChart = () => {
    const chart1 = setting1.charttype;
    setSetting1({ ...setting1, charttype: null });
    setTimeout(function () {
      setSetting1({ ...setting1, charttype: chart1 });
      setChartOpt("");
      updateLocalStorage("modelchart", {});
      form.setFieldsValue({
        textarea: "",
      });
    }, 100);
  };

  const chtonly = (
    <div id="dvCht">
      <Row gutter={4}>
        <Col span={edit ? 14 : 24}>
          <div
            style={{
              margin: 20,
            }}
          >
            {edit && (
              <div style={{ textAlign: "right" }}>
                <Tooltip title="Reload Chart">
                  <Button
                    type="link"
                    icon={<RedoOutlined />}
                    onClick={reloadChart}
                  />
                </Tooltip>
              </div>
            )}
            {setting1 &&
              config &&
              (() => {
                switch (setting1.charttype) {
                  case "pie":
                    return <PieChart config={config} />;
                  case "bar":
                    return <BarChart config={config} />;
                  case "line":
                    return <LineChart config={config} />;
                  case "column":
                    return <ColumnChart config={config} />;
                  case "area":
                    return <AreaChart config={config} />;
                  case "box plot":
                    return <BoxPlot />;
                  case "scatter":
                    return <ScatterPlot config={config} />;
                  case "matrixdiagram":
                    return <MatrixDiagram />;

                  case "treemap":
                    return (
                      <Treemap data={treemapdata} width={600} height={400} />
                    );
                  default:
                    return null;
                }
              })()}
          </div>
        </Col>
        {edit && (
          <Col span={10}>
            <div>
              <AntFormDisplay
                formArray={formArray}
                onValuesChange={onValuesChangeTable1}
                patchlist={patch}
                initialValues={initChart}
                //changedInitial={initChart}
              />
            </div>
          </Col>
        )}
      </Row>

      {edit && setting1 && setting1.charttype && (
        <ChartOption
          type={charttypeopt}
          config={chartOrigin()}
          onOptionClick={onOptionClick}
        />
      )}
    </div>
  );
  const updateLocalStorage = (title, updateObj) => {
    let local,
      local1 = localStorage.getItem(title);
    if (local1) local = JSON.parse(local1);
    local.setting = { ...local.setting, ...updateObj };

    //updateObj==={}, remove options
    if ((Object.keys(updateObj).length === 0) | !updateObj.options) {
      delete local.setting.options;
      form.resetFields();
    }
    localStorage.setItem(title, JSON.stringify(local));
  };
  const makeTableColumn = (datalist) => {
    let col = [];
    if (datalist && datalist.length > 0)
      Object.keys(datalist[0]).map((k, i) => {
        col.push({ title: k, dataIndex: k, key: k });
        return null;
      });
    return col;
  };
  const tbonly = (
    <div style={{ marginRight: 10 }}>
      <Table
        size="small"
        columns={makeTableColumn(nodelist)}
        scroll={{ x: 2000, y: 500 }}
        dataSource={nodelist}
      />
    </div>
  );

  const onConfigFinish = (val) => {
    // console.log(val);
    setChartOpt(val.textarea);
    updateLocalStorage("modelchart", { options: val.textarea });
    reloadChart();
  };
  // const onReset = () => {
  //   form.resetFields();
  //   setChartOpt("");
  // };

  const form1 = (
    <Form
      layout="vertical"
      form={form}
      name="control-hooks"
      onFinish={onConfigFinish}
    >
      <Form.Item name="textarea" label="textarea">
        <TextArea autoSize={{ minRows: 15, maxRows: 26 }} />
      </Form.Item>
      <Form.Item>
        <Button
          htmlType="button"
          onClick={() => {
            form.resetFields();
            setChartOpt("");

            updateLocalStorage("modelchart", {});
          }}
        >
          Reset
        </Button>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
  console.log("patch", patch);
  return (
    <>
      {edit ? (
        <>
          <Title level={4}>Chart</Title>
          <Divider style={{ marginTop: 0 }} />
          <Tabs size="small">
            <TabPane tab="Chart" key="1">
              {chtonly}
            </TabPane>
            <TabPane tab="Table" key="2">
              {tbonly}
            </TabPane>
            <TabPane tab="Config" key="3">
              <div style={{ marginRight: 10 }}>{form1}</div>
            </TabPane>
          </Tabs>
        </>
      ) : (
        <div style={{ marginTop: 100 }}>{chtonly}</div>
      )}
      <DarkBackground disappear={loading}>
        <div style={{ position: "absolute", top: 200, left: "50%" }}>
          <Spin spinning={loading} />
        </div>
      </DarkBackground>
    </>
  );
};
export const CleanupObj = (obj) => {
  const keyarr = Object.keys(obj);
  keyarr.map((k, i) => {
    if (!obj[k] | (obj[k] === "n/a")) delete obj[k];
    return null;
  });

  return obj;
};
export const DarkBackground = styled.div`
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 999; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */

  ${(props) =>
    props.disappear &&
    css`
      display: block; /* show */
    `}
`;
export default EasyChart;
