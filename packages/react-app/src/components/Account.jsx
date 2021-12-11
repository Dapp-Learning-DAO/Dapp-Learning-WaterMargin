import React from "react";
import { Button } from "antd";
import Address from "./Address";
import Balance from "./Balance";
import Wallet from "./Wallet";
import { useThemeSwitcher } from "react-css-theme-switcher";
import { bgColor, textColor, activeColor } from "../theme"

/*
  ~ What it does? ~

  Displays an Address, Balance, and Wallet as one Account component,
  also allows users to log in to existing accounts and log out

  ~ How can I use? ~

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

  ~ Features ~

  - Provide address={address} and get balance corresponding to the given address
  - Provide localProvider={localProvider} to access balance on local network
  - Provide userProvider={userProvider} to display a wallet
  - Provide mainnetProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide price={price} of ether and get your balance converted to dollars
  - Provide web3Modal={web3Modal}, loadWeb3Modal={loadWeb3Modal}, logoutOfWeb3Modal={logoutOfWeb3Modal}
              to be able to log in/log out to/from existing accounts
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
*/

export default function Account({
  address,
  userProvider,
  localProvider,
  mainnetProvider,
  price,
  minimized,
  web3Modal,
  loadWeb3Modal,
  logoutOfWeb3Modal,
  blockExplorer,
}) {

  const display = minimized ? (
    ""
  ) : (
    <div style={{ background: "#FFFFFF", paddingLeft: 10, paddingRight: 10, borderRadius: 5, height: 40 }}>
      {address ? <div><Address
        address={address}
        disableBlockies
        ensProvider={mainnetProvider}
        blockExplorer={blockExplorer}
        size={10}
        minimized={false}
        fontSize={14} /></div> : "Connecting..."}
      <div style={{ marginTop: -5, display: "flex", justifyContent: "start" }}>
        <Balance address={address} provider={localProvider} price={price} size={14} />
      </div>
      {/* <Wallet address={address} provider={userProvider} ensProvider={mainnetProvider} price={price} color={currentTheme == "light" ? "#1890ff" : "#2caad9"} /> */}
    </div>
  );

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      { web3Modal?.cachedProvider && display}
      &nbsp;&nbsp;
      { web3Modal && <span
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: 'center',
          width: 100,
          borderRadius: 5,
          height: 40,
          background: activeColor,
          marginLeft: 8,
          color: "#FFFFFF",
          cursor: "pointer",
          fontSize: 20
        }}
        onClick={web3Modal?.cachedProvider ? logoutOfWeb3Modal : loadWeb3Modal}
      >
        {web3Modal.cachedProvider ? "logout" : "connect"}
      </span>}
    </div>
  );
}
