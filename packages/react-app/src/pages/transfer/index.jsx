import React, { useState, useMemo } from "react";
import { Row, Col, Button, Alert, List, Card, Modal, InputNumber, Empty, message } from "antd";
import { Faucet, Ramp, Contract, GasGauge, Address, AddressInput } from "../../components";
import { mainWidth } from "../../theme";
import StackGrid from "react-stack-grid";
import { SearchQuery } from "./SearchQuery"

export const Transfer = (props) => {
  const { mainnetProvider, transferEvents, loadedAssets } = props
  const assets = useMemo(() => {
    if (!Array.isArray(loadedAssets)) return null
    const asset = {};
    for (let i = 0; i < loadedAssets?.length; i++) {
      asset[parseInt(loadedAssets[i].id)] = loadedAssets[i]
    }
    return asset
  }, [loadedAssets?.length])

  const [data, setData] = useState(transferEvents)

  return (
    <div style={{ width: mainWidth, margin: "auto", marginTop: 32, paddingBottom: 32, textAlign: "left" }}>
      <SearchQuery list={transferEvents} setData={setData} assets={assets} />
      <List
        bordered
        dataSource={data}
        renderItem={item => {
          return (
            <List.Item key={item[0] + "_" + item[1] + "_" + item.blockNumber + "_" + item[2].toNumber()}>
              <span style={{ fontSize: 16, marginRight: 8 }}>#{item[2].toNumber()}</span>
              <Address address={item[0]} ensProvider={mainnetProvider} fontSize={16} /> {"=>"}
              <Address address={item[1]} ensProvider={mainnetProvider} fontSize={16} />
            </List.Item>
          );
        }}
      />
    </div>
  )
}
