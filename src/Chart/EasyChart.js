import React, { useState, useEffect } from "react";
import _ from "lodash";
import "./components/Common/Antd.css";
import {
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
  PageHeader,
  Modal,
  message,
} from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
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
import ChartOption from "./ChartOptions";
import styled, { css } from "styled-components";

const { TabPane } = Tabs;
const { TextArea } = Input;
const formArray = formdt["5f1a590712d3bf549d18e583"];

const EasyChart = ({ authObj, showmenu, edit, onChange }) => {
  const [form] = Form.useForm();
  const [auth, setAuth] = useState(authObj);
  const [visible, setVisible] = useState(false);
  const [menu, setMenu] = useState(showmenu);
  const [editt, setEditt] = useState();
  const [nodelist, setNodelist] = useState();
  const [filterlist, setFilterlist] = useState();
  const [setting1, setSetting1] = useState();
  const [patch, setPatch] = useState();
  const [initChart, setInitChart] = useState();
  const [config, setConfig] = useState();
  //const [chartOpt, setChartOpt] = useState("");
  const [charttypeopt, setCharttypeopt] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("modelchart", JSON.stringify(authObj));
    if (!edit) setEditt(false);
    else setEditt(edit);
  }, []);

  useEffect(() => {
    if (auth) {
      setLoading(true);
      if (auth.dtlist) {
        setNodelist(auth.dtlist);
        aggre();

        //AntFormDisplay dropdown patchlist make
        if (auth.dtlist.length > 0) makeOptionArray(auth.dtlist[0]);
      }
      if (auth.setting) {
        const ds = auth.setting;
        //localStorage.setItem("modelchart", JSON.stringify(authObj));
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

        //config textarea init
        if (ds.options) {
          const optt = JSON.stringify(ds.options, null, 4);
          //setChartOpt(optt);

          form.setFieldsValue({
            textarea: optt,
          });
        }
      } else {
        setInitChart({});
      }
      setLoading(false);
    }
  }, [auth]);
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
        let avg = _.meanBy(listbyx, val);
        avg = Math.floor(avg * 100) / 100;
        let count = listbyx.length;

        switch (setting1.aggregate) {
          case "sum":
            obj[val] = sum;
            break;
          case "average":
            obj[val] = avg;
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
    setInitChart(setting1.setting); //initialValues
  };

  const onValuesChangeTable1 = (changedValues, allValues) => {
    let set2 = auth;
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
    if (["title", "desc"].indexOf(Object.keys(changedValues)[0]) === -1) {
      setSetting1(set2);
      setInitChart(set2);
    }

    //use localstorage to prevent state change
    let local = auth,
      local1 = localStorage.getItem("modelchart");
    if (local1) local = JSON.parse(local1);
    local.setting = { ...local.setting, ...changedValues };
    localStorage.setItem("modelchart", JSON.stringify(local));
  };

  // chart Data conversion
  const chartOrigin = (allValues) => {
    //if (allValues) setting1 = allValues;
    if (!setting1) return false;
    if (!(setting1 && setting1.yField)) return false;
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

  const onOptionClick = (opt) => {
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
    //setChartOpt(optt);
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
      //setChartOpt("");
      updateLocalStorage("modelchart", {});
      form.setFieldsValue({
        textarea: "",
      });
    }, 100);
  };
  const copyClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(auth, null, 4));
    message.info("Copied to clipboard");
  };
  const modal = (
    <Modal
      visible={visible}
      title="Code"
      onCancel={() => setVisible(false)}
      footer={[
        <Tooltip title="Copy code to clipboard">
          <Button key="copy" onClick={copyClipboard}>
            Copy
          </Button>
        </Tooltip>,
        <Button key="submit" type="primary" onClick={() => setVisible(false)}>
          Close
        </Button>,
      ]}
    >
      <div style={{ overflowY: "scroll", height: 250 }}>
        {JSON.stringify(auth, null, 4)}
      </div>
    </Modal>
  );
  const chtonly = (
    <div id="dvCht">
      <Row gutter={4}>
        <Col span={editt ? 14 : 24}>
          <div
            style={{
              margin: 20,
            }}
          >
            {editt && (
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

                  default:
                    return null;
                }
              })()}
          </div>
        </Col>
        {editt && (
          <Col span={10}>
            <div>
              <AntFormDisplay
                formArray={formArray}
                onValuesChange={onValuesChangeTable1}
                patchlist={patch}
                initialValues={initChart}
              />
            </div>
          </Col>
        )}
      </Row>

      {editt && setting1 && setting1.charttype && (
        <ChartOption
          type={charttypeopt}
          config={chartOrigin()}
          onOptionClick={onOptionClick}
        />
      )}
    </div>
  );
  const updateLocalStorage = (title, updateObj) => {
    let local = auth,
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
    //setChartOpt(val.textarea);
    updateLocalStorage("modelchart", { options: val.textarea });
    reloadChart();
  };
  const onSave = () => {
    let local = auth,
      local1 = localStorage.getItem("modelchart");
    if (local1) {
      local = JSON.parse(local1);
      setAuth(local);
      if (onChange) onChange(local);
    }
    setEditt(false);
  };

  const editForm = (
    <div style={{ textAlign: "right" }}>
      <Button
        type="link"
        onClick={() => {
          setVisible(true);
        }}
      >
        code
      </Button>
      <Button
        type="link"
        onClick={() => {
          setEditt(!editt);
          setInitChart(auth.setting);
        }}
      >
        edit
      </Button>
    </div>
  );
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
            //setChartOpt("");

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
  return (
    <>
      {editt ? (
        <>
          <PageHeader
            title="Chart"
            extra={
              showmenu && [
                <Button
                  key="1"
                  type="text"
                  icon={<FaCheck />}
                  onClick={onSave}
                />,
                <Button
                  key="2"
                  type="text"
                  icon={<ImCross />}
                  onClick={() => setEditt(false)}
                />,
              ]
            }
          />
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
        <>
          {menu && editForm}
          <div style={{ marginTop: 100 }}>{chtonly}</div>
        </>
      )}
      {modal}
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
