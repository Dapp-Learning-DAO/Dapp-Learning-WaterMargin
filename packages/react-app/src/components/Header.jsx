import React from "react";
import Account from "./Account";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router";
import { bgColor, textColor, activeColor, minWidth } from "../theme"

const nav = [
  { label: "YourCollectibles", path: "/" },
  { label: "Gallery", path: "/gallery" },
  { label: "Transfers", path: "/transfers" },
  /* { label: "IPFS Upload", path: "/ipfsup" }, */
  /* { label: "Debug Contracts", path: "/debugcontracts" }, */
]

export const NavBar = () => {
  const { pathname } = useLocation()
  const history = useHistory()

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      width: 500,
      position: "fixed",
      top: 20,
      left: 400,
      zIndex: 13
    }}>
      {nav?.map(item => {
        return (<div
          key={item?.label}
          style={{ color: pathname === item?.path ? activeColor : textColor, marginRight: 20, cursor: "pointer" }}
          className="cursor-pointer hover:text-red-500"
          onClick={() => history.push(item?.path)}
        >{item?.label}</div>)
      })}
    </div>
  )
}

export const Header = (props) => {
  const { address, localProvider, userProvider, mainnetProvider, price, loadWeb3Modal, web3Modal, logoutOfWeb3Modal, blockExplorer, networkDisplay, targetNetwork } = props
  return (<div style={{
    backgroundImage: `linear-gradient(to right, ${bgColor}, #f7e3b5)`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    height: 60,
    minWidth: minWidth,
    width: "100%",
    position: "fixed",
    zIndex: 12,
    top: 0
  }}>
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ fontSize: 24, fontWeight: "sold", marginRight: 20 }}>
        WaterMargin
        </div>
      <a href="https://dapp-learning.com" target="_blank" rel="noopener noreferrer" style={{ color: "gray" }}>by Dapp-Learning DAO</a>
    </div>
    {/* 👨‍💼 Your account is in the top right with a wallet at connect options */}
    <div style={{ position: "relative" }}>
      {web3Modal?.cachedProvider && networkDisplay && <div style={{ zIndex: -1, position: "absolute", right: 128, top: 18, color: targetNetwork?.color, zIndex: 10, fontStyle: "italic" }}>
        {networkDisplay}
      </div>}
      <Account
        address={address}
        localProvider={localProvider}
        userProvider={userProvider}
        mainnetProvider={mainnetProvider}
        price={price}
        web3Modal={web3Modal}
        loadWeb3Modal={loadWeb3Modal}
        logoutOfWeb3Modal={logoutOfWeb3Modal}
        blockExplorer={blockExplorer}
      />
      {/* <div style={{ position: "absolute", top: 50, right: 0 }}>
          {faucetHint}
        </div> */}
    </div>
  </div>)
}
