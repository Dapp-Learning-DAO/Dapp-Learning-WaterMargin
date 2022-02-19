import React, { useState, useCallback, useEffect, useMemo } from "react";
import StackGrid from "react-stack-grid";
import { ethers } from "ethers";
import { keyBy, isEmpty, cloneDeep, map, find } from "lodash"
import { NETWORKS } from "../../constants";
import { useLoading } from "../../components/Loading";
import { RedPacketItem } from "./RedPacketItem"
import { mainWidth } from "../../theme";

export const RedPacket = props => {
  const {
    writeContracts,
    address,
    tx,
    selectedChainId,
    mainnetProvider,
    web3Modal,
    localProvider
  } = props;

  const blockExplorer = useMemo(() => {
    return find(NETWORKS, item => String(item?.chainId) == String(selectedChainId))?.blockExplorer || ""
  }, [NETWORKS, selectedChainId])

  const tokenBalance = (token_address, userAddress) => `${blockExplorer || "https://etherscan.io/"}${"token/"}${token_address}?a=${userAddress}`;

  const [redPacketObj, setRedPacketObj] = useState({})
  const [redPacketList, setRedPacketList] = useState([])
  const { closeLoading, closeDelayLoading } = useLoading();

  useEffect(() => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "http://81.69.8.95/WaterMarginJson/redpacket.json", true);
      xhr.send();
      xhr.onload = function () {
        if (this.status === 200) {
          const response = JSON.parse(this.response);
          //kovan
          const response2 = [
            {
              "name": "虎年新春",
              "id": "0x00b1e4be13fd22b37bdb98abad696d3ceeac4ab4d98cf8419e741c1ae0243d47",
              "address": [
                "0x3238f24e7C752398872B768Ace7dd63c54CfEFEc",
                "0xa3F2Cf140F9446AC4a57E9B72986Ce081dB61E75",
                "0xFd7084a4bf147F8FE2A7eC8Ad20205B42FDc772E"
              ]
            }, {
              id: "0x7f823877dc1acea194e4271dffb8f8f4643db5dffd2e642bf87ea17aef56443c",
              name: "庆元旦，迎新春1",
              address: [
                "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033",
                "0x2FB2320BbdD9f6b8AD5a3821eF49A1668f668c53"
              ]
            }
          ]
          //matic
          const response3 = []
          const res = response
          setRedPacketObj(keyBy(res, "id"))
          setRedPacketList(res)
        };
      }
    } catch (error) {
      console.log(error);
    }
  }, [])

  useEffect(() => {
    if (writeContracts?.HappyRedPacket && address) {
      writeContracts.HappyRedPacket.on('ClaimSuccess', (id, claimer, claimed_amount, token_address) => {
        setRedPacketObj((pre) => {
          const obj = cloneDeep(pre);
          if (obj[id]) {
            obj[id] = {
              ...obj[id],
              isClaimed: String(claimer).toLowerCase() === String(address).toLowerCase(),
              claimed_amount,
              expired: false,
              token_address,
              isLoadingComplete: true
            }
          }
          return obj
        })
      });
    }
  }, [writeContracts?.HappyRedPacket, address])

  const getClaimRedDetails = useCallback(async (id, addressList, isInterval) => {
    try {
      const redDetails = await writeContracts?.HappyRedPacket.check_availability(id)
      closeLoading()
      const isClaimed = Number(redDetails.claimed_amount) !== 0;
      const isInList = addressList?.indexOf(address) >= 0;

      //matic链遇到了申领上链后回调的redDetails?.claimed_amount依旧是零的情况，故如果是申领的时候，申领回调成功了，但是依旧是未申领的状态，则继续循环调用调用查询函数。
      //tx.wait().then是打包上链成功的回调还是交易提交到链上的回调？
      /* if (isInterval && !isClaimed) {
        let timer = setTimeout(() => {
          getClaimRedDetails(id, addressList, true).then(() => {
            clearTimeout(timer)
          })
        }, 1000)
        return
      } */

      if (isClaimed) window.localStorage.setItem(id, "");

      const isLoading = window.localStorage.getItem(id);

      setRedPacketObj((pre) => {
        const obj = cloneDeep(pre);
        obj[id] = {
          ...obj[id],
          isClaimed,
          claimed_amount: redDetails?.claimed_amount,
          expired: redDetails?.expired,
          token_address: redDetails?.token_address,
          isInList,
          isLoadingComplete: !isLoading
        }
        return obj
      })
    } catch (error) {
      console.log(error)
      closeLoading()
      setRedPacketObj((pre) => {
        const obj = cloneDeep(pre);
        obj[id].isLoadingComplete = true
        obj[id].isInList = false
        return obj
      })
    }
  }, [writeContracts?.HappyRedPacket, address, selectedChainId])

  useEffect(() => {
    if (!web3Modal?.cachedProvider) closeDelayLoading()
  }, [web3Modal])

  useEffect(() => {
    // 从区块链循环获取合约红包的数据（进入页面才获取）
    if (isEmpty(redPacketList) || !writeContracts?.HappyRedPacket || !writeContracts?.HappyRedPacket?.signer || address === "0x4533cC1B03AC05651C3a3d91d8538B7D3E66cbf0" || !address || !selectedChainId) return
    for (let i = 0; i < redPacketList?.length; i++) {
      getClaimRedDetails(redPacketList[i]?.id, redPacketList[i]?.address)
    }
  }, [redPacketList, writeContracts?.HappyRedPacket, address, selectedChainId])

  const claimedNumber = useCallback((amount, decimals) => {
    const num = Number(ethers.utils.formatUnits(amount, decimals || 18))
    if (num > 1) return num.toFixed(5)
    return ethers.utils.formatUnits(amount, decimals || 18)
  }, [])

  return (
    <div style={{ width: "100%", paddingTop: 50, paddingBottom: 50 }}>
      <div style={{ width: mainWidth, margin: "auto", position: "relative" }}>
        <StackGrid columnWidth={250} gutterWidth={20} gutterHeight={32} style={{ marginTop: 20 }}>
          {map(redPacketObj, (item) => {
            return (
              <RedPacketItem
                key={`${item?.id}`}
                writeContracts={writeContracts}
                address={address}
                item={item}
                tx={tx}
                setRedPacketObj={setRedPacketObj}
                tokenBalance={tokenBalance}
                getClaimRedDetails={getClaimRedDetails}
                blockExplorer={blockExplorer}
                mainnetProvider={mainnetProvider}
                web3Modal={web3Modal}
                localProvider={localProvider}
                claimedNumber={claimedNumber}
              />
            );
          })}
        </StackGrid>
      </div>
    </div>
  );
};
