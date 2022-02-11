import React, { useState, useCallback, useEffect, useMemo } from "react";
import { AddressInput } from "../../components";
import { Modal, message } from "antd";
import { mainWidth, bgColor } from "../../theme";
import StackGrid from "react-stack-grid";
import { ethers } from "ethers";
import { hashToken } from "../../utils/getMerkleTree";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { format } from "date-fns"
import { keyBy, isEmpty, cloneDeep, map, find } from "lodash"
import { NETWORKS } from "../../constants";
import { useLoading } from "../../components/Loading";

export const RedPacket = props => {
  const {
    writeContracts,
    address,
    mainnetProvider,
    tx,
    selectedChainId
  } = props;
  const { closeLoading } = useLoading();

  const blockExplorer = useMemo(() => {
    return find(NETWORKS, item => String(item?.chainId) == String(selectedChainId))?.blockExplorer || ""
  }, [NETWORKS, selectedChainId])

  const tokenBalance = (token_address) => `${blockExplorer || "https://etherscan.io/"}${"token/"}${token_address}?a=${address}`;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectId, setSelectId] = useState();
  const [value, setValue] = useState()
  const [redPacketObj, setRedPacketObj] = useState({})
  const [redPacketList, setRedPacketList] = useState([])

  useEffect(() => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "http://81.69.8.95/WaterMarginJson/redpacket.json", true);
      xhr.send();
      xhr.onload = function () {
        if (this.status === 200) {
          const response = JSON.parse(this.response);
          /* const response = [
            {
              expireTime: 1655426061,
              id: "0x5a677eb20db4052599d76edef506c0cc358e4dabe7283cd18d2be0c0fd7bf677",
              name: "庆元旦，迎新春1",
              address: [
                "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033",
                "0x2FB2320BbdD9f6b8AD5a3821eF49A1668f668c53",
                "0x67Dcc2c5C25DD77983E0CA3dfd1aa33d1D8C0E43",
                "0xf9e9476f7148adCCF577CdDCd2052EC2797757C4",
                "0xfc2168D69BA0f2AE4E2B55FFDd7735Cdf3c9ccb6",
                "0xE0c2bbdC9B1fd0a2c35854f0aCec8AB5c8BFFbBA",
                "0x5DbeffE206A0623A3211e86b891BFA5f1CeDb47e"
              ]
            },
            {
              expireTime: 1655426061,
              id: "0xc0353aab7ad83dfdd1634b08472d9d27fed72ff3bb72f3d2a889d0bfc0d61fee",
              name: "庆元旦，迎新春2",
              address: [
                "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033",
                "0x2FB2320BbdD9f6b8AD5a3821eF49A1668f668c53",
                "0x67Dcc2c5C25DD77983E0CA3dfd1aa33d1D8C0E43",
                "0xf9e9476f7148adCCF577CdDCd2052EC2797757C4",
                "0xfc2168D69BA0f2AE4E2B55FFDd7735Cdf3c9ccb6",
                "0xE0c2bbdC9B1fd0a2c35854f0aCec8AB5c8BFFbBA",
                "0x5DbeffE206A0623A3211e86b891BFA5f1CeDb47e"
              ]
            }
          ] */
          setRedPacketObj(keyBy(response, "id"))
          setRedPacketList(response)
        }
      };
    } catch (error) {
      console.log(error);
    }
  }, [])

  const getClaimBalances = useCallback(async (id, addressList = []) => {
    try {
      const balances = await writeContracts?.HappyRedPacket.check_availability(id)
      closeLoading()
      const claimed = Number(ethers?.utils?.formatUnits(balances?.claimed_amount, 0)) !== 0
      const isInList = addressList?.indexOf(address) >= 0
      setRedPacketObj((pre) => {
        const obj = cloneDeep(pre);
        obj[id] = {
          ...obj[id],
          claimed: claimed,
          claimed_amount: balances?.claimed_amount,
          expired: balances?.expired,
          token_address: balances?.token_address,
          disable: claimed || !isInList || balances?.expired,
          isInList: isInList
        }
        return obj
      })
    } catch (error) {
      console.log(error)
    }
  }, [writeContracts?.HappyRedPacket, address, selectedChainId])

  useEffect(() => {
    if (isEmpty(redPacketList) || !writeContracts?.HappyRedPacket || !writeContracts?.HappyRedPacket?.signer || address === "0x4533cC1B03AC05651C3a3d91d8538B7D3E66cbf0" || !address || !selectedChainId) return
    for (let i = 0; i < redPacketList?.length; i++) {
      getClaimBalances(redPacketList[i]?.id, redPacketList[i]?.address)
    }
  }, [redPacketList, writeContracts?.HappyRedPacket, address, selectedChainId])

  useEffect(() => {
    setValue(address)
  }, [address])

  const handleOk = useCallback(async () => {
    if (!ethers.utils.isAddress(value)) {
      message.warning("Please enter a well-formed address");
      return;
    }
    const merkleTree = new MerkleTree(redPacketObj[selectId]?.address?.map(address => hashToken(address)), keccak256, { sortPairs: true });
    let proof = merkleTree.getHexProof(hashToken(address));

    const result = await tx(
      writeContracts.HappyRedPacket.claim(redPacketObj[selectId].id, proof, value),
      true,
    );
    handleCancel()
    result.wait().then(() => {
      message.success("claim successful")
      getClaimBalances(redPacketObj[selectId].id, redPacketObj[selectId].address)
    }).catch(() => {
      message.error("claim failed")
    })
  }, [selectId, value, address, writeContracts, redPacketObj]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ width: "100%", paddingTop: 50, paddingBottom: 50 }}>
      <div style={{ width: mainWidth, margin: "auto", position: "relative" }}>
        <StackGrid columnWidth={250} gutterWidth={20} gutterHeight={32} style={{ marginTop: 20 }}>
          {map(redPacketObj, (item, index) => {
            return (
              <div
                key={`${item.id}${index}`}
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
                    background: `linear-gradient(to bottom, #f6604f, #f45e4d)`,
                    boxShadow: "10px 10px 10px #e04a3a",
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
                    width: 180,
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
                      {item?.claimed && item?.isInList && <div style={{ fontSize: 14 }}>claimed
                      <a
                          href={tokenBalance(item?.token_address)}
                          target="_blank"
                          style={{
                            color: "#ffd9aa",
                            margin: "auto 5px"
                          }}
                        >
                          {Number(ethers.utils.formatUnits(item?.claimed_amount, 18)).toFixed(2)}
                        </a>
                        DL
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
                    {"expire time: " + format(new Date(Number(item?.expireTime) * 1000), "yyyy-MM-dd HH:mm:ss")}
                  </div>
                </div>
                <div
                  style={{
                    background: "#edcd98",
                    height: 80,
                    width: 80,
                    borderRadius: "50%",
                    position: "absolute",
                    left: 85,
                    top: 260,
                    fontSize: item?.disable ? 20 : 26,
                    color: "white",
                    cursor: item?.disable ? "no-drop" : "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                  onClick={() => {
                    if (item?.disable) return
                    setSelectId(item?.id);
                    setIsModalVisible(true);
                  }}>
                  {item?.isInList === false ? "Disable" : (item?.claimed ? "Claimed" : (item?.expired ? "Expired" : "Claim"))}
                </div>
              </div>
            );
          })}
        </StackGrid>
        <Modal
          title="Claim RedPacket"
          okText={"Claim"}
          cancelText="Cancel"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          maskClosable={false}
        >
          <AddressInput
            ensProvider={mainnetProvider}
            placeholder="claim to address"
            value={value}
            onChange={setValue}
          />
        </Modal>
      </div>
    </div>
  );
};
