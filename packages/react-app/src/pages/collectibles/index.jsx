import React, { useState, useCallback } from "react";
import { Address, AddressInput } from "../../components";
import { Modal, Button, Image, message, Tooltip } from "antd";
import { activeColor, mainWidth, bgColor } from "../../theme";
import StackGrid from "react-stack-grid";
import errorImage from "../transfer/errorImge.jpg"
import bgImage from "../../static/watermargin.png"
import { LoadingCore } from "../../components/Loading"
import { NoData } from "../../components/NoData";

export const YourCollectibles = (props) => {
  const {
    mainnetProvider,
    isInclaimList,
    assets,
    assetKeys,
    id_rank,
    blockExplorer,
    writeContracts,
    web3Modal,
    currentColl,
    transferToAddresses,
    address,
    setTransferToAddresses,
    getProof,
    tx,
    nftAddress
  } = props

  const blockExplorerLink = (contract, id) => `${blockExplorer || "https://etherscan.io/"}token/${contract}?a=${id}`;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectId, setSelectId] = useState();

  const handleOk = useCallback(() => {
    if (transferToAddresses[selectId]?.length !== 42 || transferToAddresses[selectId]?.indexOf("0x") !== 0) {
      message.warning("Please enter a well-formed address")
      return
    }
    tx(
      writeContracts.DappLearningCollectible.transferFrom(address, transferToAddresses[selectId], selectId),
    );
    setIsModalVisible(false)
  }, [selectId, transferToAddresses, address, writeContracts]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ width: "100%", paddingBottom: 32 }}>
      <div style={{
        height: "600px",
        backgroundImage: `url(${bgImage})`,
        color: "#FFFFFF",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        marginBottom: 50
      }}>
        <div style={{
          height: "100%",
          margin: "auto",
          backdropFilter: "blur(2px)",
          "-webkit-backdrop-filter": "blur(2px)",
          fontWeight: 1000,
          background: "transparent",
          textShadow: "2px 5px 5px black",
        }}>
          <div style={{ width: mainWidth, textAlign: "left", margin: "auto", paddingTop: 150 }}>
            <p style={{ fontSize: 40 }}>WaterMargin </p>
            <p style={{ fontSize: 30, margin: "50px auto" }}>《水浒传》是元末明初施耐庵（现存刊本署名》是中国历史上最早用白话文写成的章回小说之一，流传极广，脍炙人口；同时也是汉语</p>
            <p>《水浒传》是元末明初施耐庵（现存刊本署名》是中国历史上最早用白话文写成的章回小说之一，流传极广，脍炙人口；同时也是汉语言文学中具备史诗特征的作品之一，对中国乃至东亚的叙事文学都有深远的影响。</p>
            {isInclaimList !== undefined && !isInclaimList && (
              <Button
                style={{
                  width: 300,
                  height: 40,
                  background: activeColor,
                  cursor: address && getProof(address).length === 0 ? "no-drop" : "pointer",
                  borderRadius: 4,
                  color: "#FFFFFF",
                  fontSize: 18,
                  margin: "auto",
                  marginTop: 30,
                  marginBottom: 70,
                }}
                disabled={address && getProof(address).length === 0}
                onClick={() => {
                  tx(
                    writeContracts.DappLearningCollectible.mintItem(
                      window.crypto.getRandomValues(new Uint32Array(1))[0],
                      getProof(address),
                    ),
                  );
                }}
              >
                {web3Modal.cachedProvider
                  ? getProof(address).length === 0
                    ? "No permission to mint"
                    : "Mint"
                  : "Please connect Wallet"}
              </Button>
            )}
          </div>
        </div>
      </div>
      <div style={{ width: mainWidth, margin: "auto" }}>
        {currentColl?.data?.dappLearningCollectibles?.length > 0 && <p>All you have WaterMargin NFT</p>}
        {currentColl?.data?.dappLearningCollectibles?.length > 0 ? <StackGrid columnWidth={250} gutterWidth={20} gutterHeight={32} style={{ marginTop: 20 }}>
          {currentColl?.data?.dappLearningCollectibles?.map((item, index) => {
            if (!id_rank[item.tokenId]) return;
            item = { ...item, ...assets[assetKeys[id_rank[item.tokenId]]] };
            const id = id_rank[item.tokenId] * 1;
            return (
              <div
                key={`${index}${id}`}
                className="cardBox"
                style={{
                  background: bgColor,
                  boxShadow: "10px 10px 10px rgba(0,0,0,0.5)",
                  width: 250,
                  height: 275,
                  minHeight: 275,
                  borderRadius: 5,
                  border: `1px solid ${bgColor}`,
                  textAlign: "left",
                  color: "rgba(0,0,0,0.7)"
                }}>
                <Image
                  width={250}
                  height={186}
                  preview={{ mask: null }}
                  src={item?.image || errorImage}
                  placeholder={
                    <div style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      background: "#F2F2F2"
                    }}>
                      <div style={{ marginLeft: -20, marginTop: -60 }}>
                        <LoadingCore scale={2} />
                      </div>
                    </div>
                  }
                />
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
                    color: "rgba(0,0,0,0.7)",
                    zIndex: 100
                  }}
                  target="_blank"
                  href={blockExplorerLink(nftAddress, parseInt(item?.tokenId))}
                >{parseInt(item?.tokenId)}</a>
                <div style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                  marginTop: 10
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {item?.description && <Tooltip title={item?.description}>
                      <div className="ellipsis" style={{ fontSize: 16, marginRight: 8 }}>{item?.description}</div>
                    </Tooltip>}
                    <div style={{ width: 70, textAlign: "right" }}>{`Rank ${id + 1}`}</div>
                  </div>
                  <div style={{ color: activeColor, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Address address={item?.owner} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={14} size={6} disableBlockies disableCopy />
                    <Button type="primary" style={{ width: 70 }} size="small" onClick={() => {
                      setSelectId(parseInt(item?.tokenId))
                      setIsModalVisible(true)
                    }}>Transfer</Button>
                  </div>
                </div>
              </div>
            )
          })}
        </StackGrid> : <NoData description={"You don't have any WaterMargin NFT!"} />}
        <Modal
          title="Transfer WaterMargin NFT"
          okText={"Transfer"}
          cancelText="Cancel"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          maskClosable={false}
        >
          <AddressInput
            ensProvider={mainnetProvider}
            placeholder="transfer to address"
            value={transferToAddresses[selectId]}
            onChange={newValue => {
              let update = {};
              update[selectId] = newValue;
              setTransferToAddresses({ ...transferToAddresses, ...update });
            }}
          />
        </Modal>
      </div>
    </div>
  )
}
