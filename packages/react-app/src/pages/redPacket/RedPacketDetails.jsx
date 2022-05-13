import React from "react";
import { bgColor } from "../../theme";
import { map } from "lodash"
import { Address } from "../../components";

export const RedPacketDetails = props => {
  const { item, tokenBalance, mainnetProvider, blockExplorer, web3Modal, address, claimedNumber } = props;

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
            href={tokenBalance(item?.token_address, address)}
            target="_blank"
            style={{
              fontSize: 20,
              color: "#ceaa72",
              marginBottom: 10
            }}
          >
            {claimedNumber(item?.claimed_amount, item?.decimals)} {item?.symbol || " USDC"}
          </a> : <div style={{ color: "rgba(0,0,0,0.4)", fontSize: 12 }}>
            {web3Modal?.cachedProvider ? "The current address is not in list and cannot be claimed" : "Please connect network"}
          </div>}
        </div>
        <div
          style={{
            borderTop: "5px solid #f1f1f1"
          }}>
          <div style={{ padding: 10 }}>Total {item?.address?.length} RedPacket，Claimed {item?.claimers?.length || 0}.</div>
          <div className="redPacketDetails" style={{ overflowY: "auto", maxHeight: 300 }}>
            {
              item?.claimers?.length > 0 ? map(item?.claimers, (ite, i) => {
                return (
                  <div key={i} style={{
                    borderTop: "1px solid #f1f1f1",
                    padding: 10,
                    display: 'flex',
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#ceaa72"
                  }}>
                    {ite?.user && <Address address={ite?.user} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={14} size={8} disableBlockies /> }
                    { item?.token_address ? <a
                      href={tokenBalance(item?.token_address, ite?.user)}
                      target="_blank"
                      style={{
                        color: "#ceaa72"
                      }}
                    >
                      {claimedNumber(ite?.amount, item?.decimals)} {item?.symbol || " USDC"}
                    </a> : <div>{claimedNumber(ite?.amount, item?.decimals)} {item?.symbol || " USDC"}</div>}
                  </div>
                )
              }) : <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "rgba(0,0,0,0.4)",
                  height: 100
                }}>No one has claimed</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};
