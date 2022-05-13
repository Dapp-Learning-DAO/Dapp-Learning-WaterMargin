import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Modal, message } from "antd";
import { bgColor } from "../../theme";
import { ethers } from "ethers";
import { hashToken } from "../../utils/getMerkleTree";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { format } from "date-fns"
import { cloneDeep, map, isEmpty } from "lodash"
import { RedPacketDetails } from "./RedPacketDetails";
import { useQuery } from "@apollo/client";
import { happyRedPacketsGraph } from "../../gql";

export const RedPacketItem = props => {
  const {
    writeContracts,
    address,
    item,
    tx,
    getClaimRedDetails,
    tokenBalance,
    setRedPacketObj,
    mainnetProvider,
    blockExplorer,
    web3Modal,
    localProvider,
    claimedNumber
  } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const happyRedPacketsData = useQuery(happyRedPacketsGraph, {
    variables: { redpacketID: item?.id },
    pollInterval: 1000,
    context: { clientName: 'RedPacket' }
  })

  const readERC20Contracts = useMemo(() => {
    if (!item?.token_address || isEmpty(localProvider)) return
    const contract = new ethers.Contract(
      item?.token_address,
      require(`../../contracts/SimpleToken.abi.js`),
      localProvider,
    );
    return contract
  }, [localProvider, item?.token_address]);

  useEffect(() => {
    if (readERC20Contracts && item?.id && ethers.constants.AddressZero !== readERC20Contracts?.address) {
      try {
        Promise.all([readERC20Contracts.decimals(), readERC20Contracts.symbol()]).then(res => {
          setRedPacketObj((pre) => {
            const data = cloneDeep(pre);
            data[item?.id].decimals = res[0]
            data[item?.id].symbol = res[1]
            return data
          })
        })
      } catch (error) {
        console.log(error)
      }
    }
  }, [readERC20Contracts, item?.id])

  useEffect(() => {
    map(happyRedPacketsData?.data?.happyRedPackets, item => {
      setRedPacketObj((pre) => {
        const data = cloneDeep(pre);
        if (item?.id && data[item?.id]) {
          data[item?.id].claimers = item.claimers || []
        }
        return data
      })
    })
  }, [happyRedPacketsData?.data])

  const loading = (id, isLoading) => {
    setRedPacketObj((pre) => {
      const obj = cloneDeep(pre);
      obj[id].isLoadingComplete = !isLoading
      return obj
    })
  }

  const handleClaim = useCallback(async () => {
    try {
      if (!ethers.utils.isAddress(address)) {
        message.warning("Please enter a well-formed address");
        return;
      }

      loading(item.id, true)

      const merkleTree = new MerkleTree(item?.address?.map(address => hashToken(address)), keccak256, { sortPairs: true });
      let proof = merkleTree.getHexProof(hashToken(address));
      const result = await tx(writeContracts.HappyRedPacket.claim(item.id, proof), true);

      // 某个用户在某个红包id点击领取后，临时存储值为loading，目的在于用户刷新后读取该值。
      //window.localStorage.setItem(`${address}_${item.id}`, "loading")

      result.wait().then(() => {
        getClaimRedDetails(item.id, item.address, true)
      }).catch(() => {
        message.error("claim failed")
        //window.localStorage.setItem(`${address}_${item.id}`, "")
        loading(item?.id, false)
      })
    } catch (error) {
      loading(item?.id, false)
      //window.localStorage.setItem(`${address}_${item.id}`, "")
    }
  }, [address, writeContracts, item]);

  const btnText = useMemo(() => !item?.isLoadingComplete && web3Modal?.cachedProvider ? "Loading" : (item?.isInList && !item?.expired && !item?.isClaimed ? "Claim" : "Details"), [item])

  return (
    <>
      <div
        className="cardBox"
        style={{
          background: "#f25542",
          boxShadow: "10px 10px 10px rgba(224,74,58,0.5)",
          width: 250,
          height: 375,
          minHeight: 275,
          borderRadius: 14,
          textAlign: "left",
          color: "rgba(0,0,0,0.7)",
          position: "relative"
        }}
      >
        <div
          style={{
            background: item?.isInList && !item?.isClaimed && !item?.expired ? `linear-gradient(to bottom, #f6604f, #f45e4d)` : "#f56e5e",
            boxShadow: "0px 10px 10px #e04a3a",
            width: 600,
            height: 300,
            borderBottomLeftRadius: 300,
            borderBottomRightRadius: 300,
            position: "absolute",
            left: -175,
            border: `1px solid ${bgColor}`,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap"
          }}
        >
          <div style={{
            height: 20,
            color: "#ffd9aa",
            fontSize: 14,
            position: "absolute",
            left: 185,
            top: 5
          }}>Dapp Learning 专属红包{`${item?.expired ? '(Expired)' : ""}`}</div>
          <div style={{
            width: 210,
            height: 280,
            color: "#ffd9aa",
            fontSize: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            flexWrap: "wrap"
          }}>
            <div>
              <div>{item?.name}</div>
              {item?.isClaimed && item?.isInList && <div style={{ fontSize: 14 }}>claimed
                                <a
                  href={tokenBalance(item?.token_address, address)}
                  target="_blank"
                  style={{
                    color: "#ffd9aa",
                    margin: "auto 5px"
                  }}
                >
                  {Number(claimedNumber(item?.claimed_amount, item?.decimals))}
                </a>
                {item?.symbol || "USDC"}
              </div>}
            </div>
          </div>
          <div style={{
            width: 250,
            height: 20,
            color: "#ffd9aa",
            textAlign: "center",
            position: "absolute",
            top: 350,
            left: 175,
            fontSize: 14
          }}>
            {item?.expireTime && "expire time: " + format(new Date(Number(item?.expireTime) * 1000), "yyyy-MM-dd HH:mm:ss")}
          </div>
        </div>
        <div
          className={!item?.isLoadingComplete && web3Modal?.cachedProvider ? "animate-claim-loading" : ""}
          style={{
            background: "#edcd98",
            height: 80,
            width: 80,
            borderRadius: "50%",
            position: "absolute",
            left: 85,
            top: 260,
            fontSize: btnText === "Claim" ? 26 : 20,
            color: "white",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
          onClick={() => {
            if (btnText === "Claim") {
              handleClaim()
            } else {
              setIsModalVisible(true)
            }
          }}>
          {btnText}
        </div>
      </div>

      <Modal
        title={null}
        bodyStyle={{
          padding: 0,
        }}
        style={{
          padding: 0,
        }}
        visible={isModalVisible}
        footer={null}
        closable={false}
        width={400}
        onCancel={() => setIsModalVisible(false)}
      >
        <RedPacketDetails
          item={item}
          tokenBalance={tokenBalance}
          blockExplorer={blockExplorer}
          mainnetProvider={mainnetProvider}
          web3Modal={web3Modal}
          address={address}
          claimedNumber={claimedNumber}
        />
      </Modal>
    </>
  );
};
