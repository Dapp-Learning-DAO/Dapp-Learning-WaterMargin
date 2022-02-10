import React, { useState, useCallback, useEffect } from "react";
import { AddressInput } from "../../components";
import { Modal, message } from "antd";
import { mainWidth, bgColor } from "../../theme";
import StackGrid from "react-stack-grid";
import { LoadingNFT } from "../collectibles/LoadingNFT"
import { ethers } from "ethers";
import { hashToken } from "../../utils/getMerkleTree";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { format } from "date-fns"

export const RedPacket = props => {
  const {
    writeContracts,
    address,
    mainnetProvider,
    tx,
  } = props;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectIndex, setSelectIndex] = useState();
  const [value, setValue] = useState()
  const [redPacketList, setRedPacketList] = useState([])

  useEffect(() => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "http://81.69.8.95/WaterMarginJson/redpacket.json", true);
      xhr.send();
      xhr.onload = function () {
        if (this.status === 200) {
          //const response = JSON.parse(this.response);
          const response = JSON.parse(`[{
            "name": "虎年新春",
            "id": "0xd14b71cfe8386660b278b6fa293f6407047d1a978bbbe13e6b5c87142a994fa3",
            "address": [
              "0xa111C225A0aFd5aD64221B1bc1D5d817e5D3Ca15",
              "0x8de806462823aD25056eE8104101F9367E208C14",
              "0x801EfbcFfc2Cf572D4C30De9CEE2a0AFeBfa1Ce1",
              "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033"
            ],
            "expireTime": 1645290061
          },{
            "name": "庆元旦",
            "id": "0xd14b71cfe8386660b278b6fa293f6407047d1a978bbbe13e6b5c87142a994fa3",
            "address": [
              "0xa111C225A0aFd5aD64221B1bc1D5d817e5D3Ca15",
              "0xBcfF64A3f8EE87d8D82B8c9b6D35b150761b430D",
              "0x801EfbcFfc2Cf572D4C30De9CEE2a0AFeBfa1Ce1",
              "0xf0A3FdF9dC875041DFCF90ae81D7E01Ed9Bc2033"
            ],
            "expireTime": 1644426061
          }]`)
          setRedPacketList(response)
        }
      };
    } catch (error) {
      console.log(error);
    }
  }, [])

  useEffect(() => {
    setValue(address)
  }, [address])

  const handleOk = useCallback(async () => {
    if (!ethers.utils.isAddress(value)) {
      message.warning("Please enter a well-formed address");
      return;
    }
    const merkleTree = new MerkleTree(redPacketList[selectIndex].address?.map(address => hashToken(address)), keccak256, { sortPairs: true });
    let proof = merkleTree.getHexProof(hashToken(address));

    const result = await tx(
      writeContracts.HappyRedPacket.claim(redPacketList[selectIndex].id, proof, value),
      true,
    );
    result.wait().then(() => {
      message.success("claim successful")
      handleCancel()
    }).catch(() => {
      message.error("claim failed")
    })
  }, [selectIndex, value, address, writeContracts, redPacketList]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getIsExpire = (time)=>{
    return Number(time) * 1000 > new Date().valueOf()
  }

  return (
    <div style={{ width: "100%", paddingTop: 50, paddingBottom: 50 }}>
      <div style={{ width: mainWidth, margin: "auto", position: "relative" }}>
        {redPacketList?.length > 0 ? (<StackGrid columnWidth={250} gutterWidth={20} gutterHeight={32} style={{ marginTop: 20 }}>
          {redPacketList?.map((item, index) => {
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
                    textAlign: "center"
                  }}>
                    {item?.name}
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
                <div style={{
                  background: "#edcd98",
                  height: 80,
                  width: 80,
                  borderRadius: "50%",
                  position: "absolute",
                  left: 85,
                  top: 260,
                  fontSize: getIsExpire(item?.expireTime) ? 20 : 26,
                  color: "white",
                  cursor: getIsExpire(item?.expireTime) ? "no-drop" : "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
                  onClick={() => {
                    if(getIsExpire(item?.expireTime)) return
                    setSelectIndex(index);
                    setIsModalVisible(true);
                  }}>
                  { getIsExpire(item?.expireTime) ? "Expired" : "claim" }
                </div>
              </div>
            );
          })}
        </StackGrid>)
          : <LoadingNFT />
        }
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
