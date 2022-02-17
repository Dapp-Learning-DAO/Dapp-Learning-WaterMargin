import React, { useEffect } from "react";
import { bgColor } from "../../theme";
import { ethers } from "ethers";
import { map } from "lodash"
import { Address } from "../../components";

export const RedPacketDetails = props => {
  const { item, tokenBalance, mainnetProvider, blockExplorer } = props;

  /* useEffect(() => {
    console.log(item)
  }, [item]) */

  return (
    <div
      style={{
        overflow: "hidden",
        width: 400,
        maxHeight: 550,
        textAlign: "left",
        borderRadius: 4,
        color: "rgba(0,0,0,0.7)",
        position: "relative"
      }}
    >
      <div
        style={{
          background: `#f25542`,
          boxShadow: "0px 5px 10px #e04a3a",
          width: 800,
          height: 800,
          borderBottomLeftRadius: 400,
          borderBottomRightRadius: 400,
          position: "absolute",
          top: -700,
          left: -200,
          border: `1px solid ${bgColor}`,
        }}
      >
        <p style={{
          paddingTop: 720,
          fontSize: 20,
          textAlign: "center",
          color: "#ffd9aa",
        }}>Dapp Learning 专属红包{`${item?.expired ? '(Expired)' : ""}`}</p>
      </div>
      <div
        style={{
          paddingTop: 100,
          height: "100%"
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: 20
          }}>
          <p>{item?.name}</p>
          {item?.isInList ? <a
            href={tokenBalance(item?.token_address)}
            target="_blank"
            style={{
              fontSize: 20,
              color: "#ceaa72",
              marginBottom: 10
            }}
          >
            {item?.claimed_amount2} DAI
          </a> : <div style={{ color: "rgba(0,0,0,0.4)", fontSize: 12 }}>当前地址不在红包名单内，无法领取</div>}
        </div>
        <div
          style={{
            borderTop: "5px solid #f1f1f1"
          }}>
          <div style={{ padding: 10 }}>共{item?.address?.length}个红包，已领取{item?.claimers?.length || 0}个</div>
          <div className="redPacketDetails" style={{ overflowY: "auto", maxHeight: 300 }}>
            {
              item?.claimers?.length > 0 ? map(item?.claimers, (ite, i) => {
                return (
                  <div key={i} style={{
                    borderTop: "1px solid #f1f1f1",
                    padding: 10,
                    display: 'flex',
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <Address address={ite?.user} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={14} size={8} disableBlockies />
                    <a
                      href={tokenBalance(item?.token_address)}
                      target="_blank"
                      style={{
                        color: "#ceaa72"
                      }}
                    >
                      {ethers?.utils?.formatUnits(ite?.amount, 18)} DAI
                  </a>
                  </div>
                )
              }) : <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "rgba(0,0,0,0.4)",
                  height: 100
                }}>暂无人领取</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};