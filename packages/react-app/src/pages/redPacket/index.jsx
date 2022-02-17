import React, { useState, useCallback, useEffect, useMemo } from "react";
import { mainWidth } from "../../theme";
import StackGrid from "react-stack-grid";
import { ethers, BigNumber } from "ethers";
import { keyBy, isEmpty, cloneDeep, map, find } from "lodash"
import { NETWORKS } from "../../constants";
import { useLoading } from "../../components/Loading";
import { RedPacketItem } from "./RedPacketItem"
import { happyRedPacketsGraph } from "../../gql";
import { useQuery } from "@apollo/client";

export const RedPacket = props => {
  const {
    writeContracts,
    address,
    tx,
    selectedChainId,
    mainnetProvider
  } = props;

  const blockExplorer = useMemo(() => {
    return find(NETWORKS, item => String(item?.chainId) == String(selectedChainId))?.blockExplorer || ""
  }, [NETWORKS, selectedChainId])

  const tokenBalance = (token_address) => `${blockExplorer || "https://etherscan.io/"}${"token/"}${token_address}?a=${address}`;

  const [redPacketObj, setRedPacketObj] = useState({})
  const [redPacketList, setRedPacketList] = useState([])
  const { closeLoading } = useLoading();
  const happyRedPacketsData = useQuery(happyRedPacketsGraph)

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

  useEffect(() => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "http://81.69.8.95/WaterMarginJson/redpacket.json", true);
      xhr.send();
      xhr.onload = function () {
        if (this.status === 200) {
          const response = JSON.parse(this.response);
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
              name: "庆元旦，迎新春4",
              address: [
                "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033",
                "0x2FB2320BbdD9f6b8AD5a3821eF49A1668f668c53"
              ]
            }, {
              id: "0x1227eb6c0bc19cb37cacdb9b6c105c5f00aaf109eaada7f98d6b646abdf9a6ff",
              name: "庆元旦，迎新春4",
              address: [
                "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033",
                "0x2FB2320BbdD9f6b8AD5a3821eF49A1668f668c53"
              ]
            }, {
              id: "0xda67b67a7cbd4426372fb7732d008a0e0aed9b4bc4a14796e4dc94a254208ac6",
              name: "庆元旦，迎新春4",
              address: [
                "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033",
                "0x2FB2320BbdD9f6b8AD5a3821eF49A1668f668c53"
              ]
            }
          ]
          const res = response
          setRedPacketObj(keyBy(res, "id"))
          setRedPacketList(res)
        };
      }
    } catch (error) {
      console.log(error);
    }
  }, [])

  const getClaimredDetails = useCallback(async (id, addressList, isInterval) => {
    try {
      const redDetails = await writeContracts?.HappyRedPacket.check_availability(id)
      closeLoading()
      const claimedAmount = claimedNumber(redDetails.claimed_amount)
      const isClaimed = Number(claimedAmount) !== 0
      const isInList = addressList?.indexOf(address) >= 0

      //matic链遇到了申领上链后回调的redDetails?.claimed_amount依旧是零的情况，故如果是申领的时候，申领回调成功了，但是依旧是未申领的状态，则继续循环调用调用查询函数。
      //tx.wait().then是打包上链成功的回调还是交易提交到链上的回调？
      if (isInterval && !isClaimed) {
        let timer = setTimeout(() => {
          getClaimredDetails(id, addressList, isInterval).then(() => {
            clearTimeout(timer)
          })
        }, 2000)
        return
      }

      setRedPacketObj((pre) => {
        const obj = cloneDeep(pre);
        obj[id] = {
          ...obj[id],
          isClaimed,
          balance: ethers?.utils?.formatUnits(redDetails?.claimed_amount, 18),
          claimed_amount: claimedAmount,
          claimed_amount2: ethers?.utils?.formatUnits(redDetails?.claimed_amount, 18),
          claimed: Number(ethers?.utils?.formatUnits(redDetails?.claimed, 0)),
          total: Number(ethers?.utils?.formatUnits(redDetails?.total, 0)),
          expired: redDetails?.expired,
          token_address: redDetails?.token_address,
          isInList,
          isLoadingComplete: true
        }
        return obj
      })
    } catch (error) {
      console.log(error)
      console.log("一般都是networkId与合约部署的networkId不一致造成的")
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
    // 从区块链获取合约红包的数据
    if (isEmpty(redPacketList) || !writeContracts?.HappyRedPacket || !writeContracts?.HappyRedPacket?.signer || address === "0x4533cC1B03AC05651C3a3d91d8538B7D3E66cbf0" || !address || !selectedChainId) return
    for (let i = 0; i < redPacketList?.length; i++) {
      getClaimredDetails(redPacketList[i]?.id, redPacketList[i]?.address)
    }
  }, [redPacketList, writeContracts?.HappyRedPacket, address, selectedChainId])

  const claimedNumber = useCallback((amount) => {
    if (amount instanceof BigNumber) {
      const num = Number(ethers.utils.formatUnits(amount, 18))
      if (num > 10000) return num.toFixed(2)
      if (num > 100) return num.toFixed(4)
      if (num > 1) return num.toFixed(6)
      if (num > 0.0001) return num.toFixed(8)
      if (num > 0.00000001) return num.toFixed(12)
      return num
    }
    return amount
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
                selectedChainId={selectedChainId}
                setRedPacketObj={setRedPacketObj}
                tokenBalance={tokenBalance}
                getClaimredDetails={getClaimredDetails}
                blockExplorer={blockExplorer}
                mainnetProvider={mainnetProvider}
              />
            );
          })}
        </StackGrid>
      </div>
    </div>
  );
};
