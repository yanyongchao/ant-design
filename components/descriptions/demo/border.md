---
order: 1
title:
  zh-CN: 带边框的
  en-US: border
---

## zh-CN

带边框和背景颜色列表。

## en-US

Descriptions with border and background color.

```tsx
import { Descriptions } from 'antd';
import React from 'react';

const columns = [
  [
    {
      span: 1,
      rowSpan: 1,
    },
    {
      span: 2,
      rowSpan: 2,
    },
    {
      span: 2,
      rowSpan: 2,
    },
  ],
  [
    {
      span: 1,
      rowSpan: 1,
    },
  ],
  [
    {
      span: 5,
      rowSpan: 1,
    },
  ],
  [
    {
      span: 5,
      rowSpan: 1,
    },
  ],
];

const App: React.FC = () => (
  <Descriptions title="User Info" bordered column={5} columns={columns}>
    <Descriptions.Item label="Automatic Renewal">YES</Descriptions.Item>
    <Descriptions.Item label="Product" rowSpan={2} span={2}>
      Cloud Database
    </Descriptions.Item>
    <Descriptions.Item label="Product" rowSpan={2} span={2}>
      Cloud Database
    </Descriptions.Item>
    <Descriptions.Item label="Automatic Renewal" skip={4}>
      YES
    </Descriptions.Item>
    <Descriptions.Item label="Automatic Renewal">YES</Descriptions.Item>
    <Descriptions.Item label="Automatic Renewal">YES</Descriptions.Item>
  </Descriptions>
);

export default App;
```

<!--
<Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item>
    <Descriptions.Item label="Automatic Renewal">YES</Descriptions.Item>
    <Descriptions.Item label="Order time">2018-04-24 18:00:00</Descriptions.Item>
    <Descriptions.Item label="Usage Time" span={2}>
      2019-04-24 18:00:00
    </Descriptions.Item>
    <Descriptions.Item label="Status" span={3}>
      <Badge status="processing" text="Running" />
    </Descriptions.Item>
    <Descriptions.Item label="Negotiated Amount">$80.00</Descriptions.Item>
    <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
    <Descriptions.Item label="Official Receipts">$60.00</Descriptions.Item>
    <Descriptions.Item label="Config Info">
      Data disk type: MongoDB
      <br />
      Database version: 3.4
      <br />
      Package: dds.mongo.mid
      <br />
      Storage space: 10 GB
      <br />
      Replication factor: 3
      <br />
      Region: East China 1<br />
    </Descriptions.Item>
 -->
