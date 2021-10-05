# imcChart

<div align="center">

A React chart library, based on [Ant Chart](https://github.com/antvis/G2Plot)

![build](https://github.com/ant-design/ant-design-charts/workflows/build/badge.svg)
![npm](https://img.shields.io/npm/v/@ant-design/charts)
![npm](https://img.shields.io/npm/dm/@ant-design/charts)
[![GitHub stars](https://img.shields.io/github/stars/ant-design/ant-design-charts)](https://github.com/ant-design/ant-design-charts/stargazers)
[![npm License](https://img.shields.io/npm/l/@ant-design/charts.svg)](https://www.npmjs.com/package/@ant-design/charts)

</div>

<div align="center">
<img src="https://i.ibb.co/LP9mPFg/imcchart-edit.png" width="600">
</div>

English | [한글](./README-kr_KR.md)

## ✨ Features

- Easy to integrate
- Provide editing tool
- Only Json data

## 📦 Installation

```bash | pure
$ npm install imcchart
```

## 🔨 Usage

```tsx | pure
import React from "react";
import EasyChart from "imcchart";

const ChartDemo = () => {
  const sampledata = {
    setting: {
      title: "Sales by Country",
      charttype: "column",
      xField: "Country",
      yField: "Sales",
      aggregate: "sum",
      series: "",
    },
    dtlist: [
      {
        Country: "Canada",
        Product: "Carretera",
        UnitsSold: 1618.5,
        ManufacturingPrice: 3,
        SalePrice: 20,
        GrossSales: 32370,
        Sales: 32370,
      },
      {
        Country: "Germany",
        Product: "Carretera",
        UnitsSold: 1321,
        ManufacturingPrice: 3,
        SalePrice: 20,
        GrossSales: 26420,
        Sales: 26420,
      },
      {
        Country: "France",
        Product: "Carretera",
        UnitsSold: 2178,
        ManufacturingPrice: 3,
        SalePrice: 15,
        GrossSales: 32670,
        Sales: 32670,
      },
      {
        Country: "Germany",
        Product: "Carretera",
        UnitsSold: 888,
        ManufacturingPrice: 3,
        SalePrice: 15,
        GrossSales: 13320,
        Sales: 13320,
      },
    ],
  };

  return (
    <div>
      <EasyChart authObj={sampledata} showmenu={true} />
    </div>
  );
};
export default Page;
```

### ✨ [Demo](http://imcmaster.iptime.org:5009)

## 📜 Document & API

See chart API for details. Common props:

| Property | Description          | Type      | defaultValue |
| -------- | -------------------- | --------- | ------------ |
| showmenu | edit or display      | boolean   |              |
| authObj  | chart data & setting | json data |              |

## License

MIT
