import React, { useState, useMemo } from "react";
import { Address } from "../../components";
import { activeColor, bgColor, mainWidth } from "../../theme";
import StackGrid from "react-stack-grid";
import { SearchQuery } from "./SearchQuery"
import { useLoading } from "../../components/Loading";
import { NoData } from "../../components/NoData";

export const Transfer = (props) => {
  const { loading } = useLoading();
  const { mainnetProvider, transferEvents, loadedAssets, blockExplorer, nftAddress } = props
  const blockExplorerLink = (contract, id) => `${blockExplorer || "https://etherscan.io/"}token/${contract}?a=${id}`;
  const assets = useMemo(() => {
    if (!(Array.isArray(loadedAssets) && loadedAssets?.length)) return null
    const asset = {};
    for (let i = 0; i < loadedAssets?.length; i++) {
      asset[parseInt(loadedAssets[i].id)] = loadedAssets[i]
    }
    return asset
  }, [loadedAssets?.length])

  const [data, setData] = useState(transferEvents)

  return (
    <div style={{ width: mainWidth, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "auto", width: 1060, textAlign: "left" }}>
        {data?.length > 0 ? <div> 共{data?.length}条记录</div> : <div style={{ color: "transparent" }}> 共{data?.length}条记录</div>}
        {transferEvents?.length > 0 && <SearchQuery list={transferEvents} setData={setData} assets={assets} />}
      </div>
      { assets ? <StackGrid columnWidth={250} gutterWidth={20} gutterHeight={32} style={{ marginTop: 20 }}>
        {data?.map(item => {
          if (!(assets && assets[parseInt(item.tokenId["_hex"])]?.image)) return null
          return (
            <div
              key={item[0] + "_" + item[1] + "_" + item.blockNumber + "_" + item[2].toNumber()}
              className="cardBox"
              style={{
                background: bgColor,
                boxShadow: "10px 10px 10px rgba(0,0,0,0.7)",
                width: 250,
                minHeight: assets ? 275 : 180,
                borderRadius: 5,
                border: `1px solid ${bgColor}`,
                textAlign: "left",
                color: "rgba(0,0,0,0.7)"
              }}>
              { assets && assets[parseInt(item.tokenId["_hex"])]?.image && <img src={assets[parseInt(item.tokenId["_hex"])]?.image} style={{ borderRadius: 5 }} />}
              <a
                style={{
                  fontSize: 20,
                  borderRadius: "50%",
                  background: "#FFFFFF",
                  width: 40,
                  height: 40,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: -20,
                  marginLeft: 105,
                  cursor: "pointer",
                  fontStyle: "italic",
                  color: "rgba(0,0,0,0.7)"
                }}
                target="_blank"
                href={blockExplorerLink(nftAddress, item[2].toNumber())}
              >{item[2].toNumber()}</a>
              <div style={{
                paddingLeft: 10,
                marginTop: 10
              }}>
                {assets && assets[parseInt(item.tokenId["_hex"])]?.description && <span style={{ fontSize: 16, marginRight: 8 }}>{assets[parseInt(item.tokenId["_hex"])]?.description}</span>}
                <div style={{ color: activeColor }}>
                  <Address address={item[0]} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={14} size={5} disableBlockies disableCopy />&nbsp;&nbsp;{"=>"}&nbsp;&nbsp;
                  <Address address={item[1]} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={14} size={5} disableBlockies disableCopy />
                </div>
              </div>
            </div>
          );
        })}
      </StackGrid> : !loading ? (
        <NoData style={{ marginTop: 50 }} />
      ) : null}
    </div>
  )
}
