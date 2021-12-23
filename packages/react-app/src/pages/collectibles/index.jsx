import React, { useState, useCallback } from "react";
import { Address, AddressInput } from "../../components";
import { Modal, Button, Image, message, Tooltip } from "antd";
import { activeColor, mainWidth, bgColor } from "../../theme";
import StackGrid from "react-stack-grid";
import errorImage from "../transfer/errorImge.jpg";
import bgImage from "../../static/watermargin.png";
import { LoadingCore } from "../../components/Loading";
import { NoData } from "../../components/NoData";
import styles from "./index.module.css";

export const YourCollectibles = props => {
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
    nftAddress,
    loadWeb3Modal,
  } = props;

  const blockExplorerLink = (contract, id) => `${blockExplorer || "https://etherscan.io/"}token/${contract}?a=${id}`;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectId, setSelectId] = useState();
  const [hadClick, setHadClick] = useState(false);

  const handleOk = useCallback(() => {
    if (transferToAddresses[selectId]?.length !== 42 || transferToAddresses[selectId]?.indexOf("0x") !== 0) {
      message.warning("Please enter a well-formed address");
      return;
    }
    tx(writeContracts.DappLearningCollectible.transferFrom(address, transferToAddresses[selectId], selectId));
    setIsModalVisible(false);
  }, [selectId, transferToAddresses, address, writeContracts]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div style={{ width: "100%", paddingBottom: 32 }}>
      <div
        style={{
          height: "600px",
          backgroundImage: `url(${bgImage})`,
          color: "#FFFFFF",
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          marginBottom: 50,
        }}
      >
        <div
          style={{
            height: "100%",
            margin: "auto",
            backdropFilter: "blur(2px)",
            fontWeight: 1000,
            background: "transparent",
            textShadow: "5px 5px 5px #000000",
          }}
        >
          <div style={{ width: mainWidth, textAlign: "left", margin: "auto", paddingTop: 100 }}>
            <div style={{ fontSize: 40 }}>Water Margin </div>
            <p style={{ fontSize: 30, margin: "10px auto" }}>
              Water Margin is a chapter novel written by Shi Naian in the late Yuan and early Ming dynasties in China.
            </p>
            <div style={{ fontSize: 20 }}>
              It tells a story that 108 heroes in the Song Dynasty in China who rebelled against oppression, were
              recruited by the emperor, and fought for him, but finally died out. It reflects the main contradiction in
              feudal society - the contradiction between the peasant class and the landlord class, showing a vigorous
              peasant revolutionary struggle. It reveals the darkness of the feudal society and the evil of the ruling
              class, and points out that the social root of the peasant uprising is the cruel feudal oppression and
              exploitation, and praises the justice of the peasant revolutionary struggle.
            </div>
            {isInclaimList !== undefined && !isInclaimList && (
              <Button
                className={styles.mintBtn}
                type="primary"
                disabled={(address && getProof(address).length === 0 && web3Modal.cachedProvider) || hadClick}
                onClick={async () => {
                  // 加了个首页可以连接钱包的功能
                  try {
                    if (!web3Modal.cachedProvider) {
                      loadWeb3Modal().then(() => {
                        // 如果不强刷，那么在调用loadWeb3Modal函数连接成功后，此时的 isInclaimList 值为false，所以mint按钮还是会显示出来。过一会儿后isInclaimList又变为了 true，mint又给隐藏了。
                        // 所以显示了mint按钮，但是用户点击后发现没效果，后面又自动隐藏了，体验不好。而之前他们写的逻辑不敢乱动，所以进行强制刷新。这个问题一直存在，之前的逻辑不敢动，故仅在此处处理了以下。
                        window.location.reload();
                      });
                    } else {
                      await tx(
                        writeContracts.DappLearningCollectible.mintItem(
                          window.crypto.getRandomValues(new Uint32Array(1))[0],
                          getProof(address),
                        ),
                      );
                      setHadClick(true);
                    }
                  } catch (error) {
                    console.log(error);
                  }
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
        {currentColl?.data?.dappLearningCollectibles?.length > 0 ? (
          <StackGrid columnWidth={250} gutterWidth={20} gutterHeight={32} style={{ marginTop: 20 }}>
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
                    color: "rgba(0,0,0,0.7)",
                  }}
                >
                  <Image
                    width={250}
                    height={186}
                    preview={{ mask: null }}
                    src={item?.image || errorImage}
                    placeholder={
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "#F2F2F2",
                        }}
                      >
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
                      zIndex: 100,
                    }}
                    target="_blank"
                    href={blockExplorerLink(nftAddress, parseInt(item?.tokenId))}
                  >
                    {parseInt(item?.tokenId)}
                  </a>
                  <div
                    style={{
                      paddingLeft: 10,
                      paddingRight: 10,
                      marginTop: 10,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      {item?.description && (
                        <Tooltip title={item?.description}>
                          <div className="ellipsis" style={{ fontSize: 16, marginRight: 8 }}>
                            {item?.description}
                          </div>
                        </Tooltip>
                      )}
                      <div style={{ width: 70, textAlign: "right" }}>{`Rank ${id + 1}`}</div>
                    </div>
                    <div
                      style={{
                        color: activeColor,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Address
                        address={item?.owner}
                        ensProvider={mainnetProvider}
                        blockExplorer={blockExplorer}
                        fontSize={14}
                        size={6}
                        disableBlockies
                        disableCopy
                      />
                      <Button
                        type="primary"
                        style={{ width: 70 }}
                        size="small"
                        onClick={() => {
                          setSelectId(parseInt(item?.tokenId));
                          setIsModalVisible(true);
                        }}
                      >
                        Transfer
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </StackGrid>
        ) : (
          <NoData description={"You don't have any WaterMargin NFT!"} />
        )}
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
  );
};
