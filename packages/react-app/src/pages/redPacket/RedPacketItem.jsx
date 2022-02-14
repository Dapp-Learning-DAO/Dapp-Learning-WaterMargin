import React, { useState, useCallback, useEffect, useMemo } from "react";
import { AddressInput } from "../../components";
import { Modal, message } from "antd";
import { bgColor } from "../../theme";
import { ethers, BigNumber } from "ethers";
import { hashToken } from "../../utils/getMerkleTree";
import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { format } from "date-fns"
import { cloneDeep } from "lodash"
import { useIsExpire } from "./GetIsExpire"

export const RedPacketItem = props => {
    const {
        writeContracts,
        address,
        item,
        tx,
        mainnetProvider,
        getClaimBalances,
        tokenBalance,
        setRedPacketObj,
        selectedChainId
    } = props;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const isExpire = useIsExpire(item?.expireTime)

    useEffect(() => {
        if (isExpire && item?.id && !item?.expired && item?.address && writeContracts?.HappyRedPacket && writeContracts?.HappyRedPacket?.signer && address !== "0x4533cC1B03AC05651C3a3d91d8538B7D3E66cbf0" && address && selectedChainId) {
            // 到过期的时间点再次请求一次
            getClaimBalances(item.id, item.address)
        }
    }, [isExpire, item?.id, item?.expired, writeContracts?.HappyRedPacket, address, selectedChainId])

    const [value, setValue] = useState()

    const handleCancel = () => setIsModalVisible(false);

    useEffect(() => setValue(address), [address])

    const handleOk = useCallback(async () => {
        if (!ethers.utils.isAddress(value)) {
            message.warning("Please enter a well-formed address");
            return;
        }
        const merkleTree = new MerkleTree(item?.address?.map(address => hashToken(address)), keccak256, { sortPairs: true });
        let proof = merkleTree.getHexProof(hashToken(address));
        const result = await tx(
            writeContracts.HappyRedPacket.claim(item.id, proof, value),
            true,
        );
        setRedPacketObj((pre) => {
            const obj = cloneDeep(pre);
            obj[item.id].isLoadingComplete = false
            return obj
        })
        handleCancel()
        result.wait().then(() => {
            getClaimBalances(item.id, item.address, true)
        }).catch(() => {
            message.error("claim failed")
        })
    }, [value, address, writeContracts, item]);

    const claimedNumber = useMemo(() => {
        if (item?.claimed_amount instanceof BigNumber) {
            const num = Number(ethers.utils.formatUnits(item?.claimed_amount, 18)).toFixed(10)
            if (Number(num) === 0) {
                return Number(ethers.utils.formatUnits(item?.claimed_amount, 1)).toFixed(5)
            }
            return num
        }
        return item?.claimed_amount
    }, [item])

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
                        height: 20,
                        color: "#ffd9aa",
                        fontSize: 14,
                        position: "absolute",
                        left: 185,
                        top: 5
                    }}>Dapp Learning 专属红包</div>
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
                                    {claimedNumber}
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
                        fontSize: !item?.isLoadingComplete ? 18 : (item?.disable ? 20 : 26),
                        color: "white",
                        cursor: item?.disable ? "no-drop" : "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    onClick={() => {
                        if (item?.disable) return
                        setIsModalVisible(true);
                    }}>
                    {!item?.isLoadingComplete ? "Loading" : (item?.isInList === false ? "Disable" : (item?.claimed ? "Claimed" : (item?.expired ? "Expired" : "Claim")))}
                </div>
            </div>

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
        </>
    );
};
