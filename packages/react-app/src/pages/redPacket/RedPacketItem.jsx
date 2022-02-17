import React, { useState, useCallback, useMemo } from "react";
import { Modal, message } from "antd";
import { bgColor } from "../../theme";
import { ethers } from "ethers";
import { hashToken } from "../../utils/getMerkleTree";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { format } from "date-fns"
import { cloneDeep } from "lodash"
import { useIsExpire } from "./GetIsExpire"
import { RedPacketDetails } from "./RedPacketDetails";
import { usePoller } from "eth-hooks";

export const RedPacketItem = props => {
    const {
        writeContracts,
        address,
        item,
        tx,
        getClaimredDetails,
        tokenBalance,
        setRedPacketObj,
        selectedChainId,
        mainnetProvider,
        blockExplorer
    } = props;
    const [isModalVisible, setIsModalVisible] = useState(false);
    //const isExpire = useIsExpire(item?.expireTime)

    const getDetails = useCallback(() => {
        if (item?.id && !item?.expired && item?.address && writeContracts?.HappyRedPacket && writeContracts?.HappyRedPacket?.signer && address !== "0x4533cC1B03AC05651C3a3d91d8538B7D3E66cbf0" && address && selectedChainId) {
            getClaimredDetails(item.id, item.address)
        }
    }, [item?.id, item?.expired, writeContracts?.HappyRedPacket, address, selectedChainId])

    usePoller(getDetails, 10000);

    /* useEffect(() => {
        if (isExpire && item?.id && !item?.expired && item?.address && writeContracts?.HappyRedPacket && writeContracts?.HappyRedPacket?.signer && address !== "0x4533cC1B03AC05651C3a3d91d8538B7D3E66cbf0" && address && selectedChainId) {
            // 到过期的时间点再次请求一次
            getClaimredDetails(item.id, item.address)
        }
    }, [isExpire, item?.id, item?.expired, writeContracts?.HappyRedPacket, address, selectedChainId]) */

    const handleClaim = useCallback(async () => {
        if (!ethers.utils.isAddress(address)) {
            message.warning("Please enter a well-formed address");
            return;
        }
        const merkleTree = new MerkleTree(item?.address?.map(address => hashToken(address)), keccak256, { sortPairs: true });
        let proof = merkleTree.getHexProof(hashToken(address));
        const result = await tx(
            writeContracts.HappyRedPacket.claim(item.id, proof),
            true,
        );
        setRedPacketObj((pre) => {
            const obj = cloneDeep(pre);
            obj[item.id].isLoadingComplete = false
            return obj
        })
        result.wait().then(() => {
            getClaimredDetails(item.id, item.address, true)
        }).catch(() => {
            message.error("claim failed")
            setRedPacketObj((pre) => {
                const obj = cloneDeep(pre);
                obj[item.id].isLoadingComplete = true
                return obj
            })
        })
    }, [address, writeContracts, item]);

    const btnText = useMemo(() => !item?.isLoadingComplete ? "Loading" : (item?.isInList && !item?.expired && !item?.isClaimed ? "Claim" : "Details"), [item])

    return (
        <>
            <div
                className="cardBox"
                style={{
                    background: item?.isInList && !item?.isClaimed && !item?.expired ? "#f25542" : "#f25542",
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
                            {item?.isClaimed && item?.isInList && <div style={{ fontSize: 14 }}>claimed
                                <a
                                    href={tokenBalance(item?.token_address)}
                                    target="_blank"
                                    style={{
                                        color: "#ffd9aa",
                                        margin: "auto 5px"
                                    }}
                                >
                                    {item?.claimed_amount}
                                </a>
                        DAI
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
                    className={!item?.isLoadingComplete ? "animate-claim-loading" : ""}
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
                />
            </Modal>
        </>
    );
};
