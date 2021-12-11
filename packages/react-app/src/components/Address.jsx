import React from "react";
import Blockies from "react-blockies";
import { Typography, Skeleton } from "antd";
import { useLookupAddress } from "../hooks";
import { activeColor } from "../theme";

// changed value={address} to address={address}

/*
  ~ What it does? ~

  Displays an address with a blockie image and option to copy address

  ~ How can I use? ~

  <Address
    address={address}
    ensProvider={mainnetProvider}
    blockExplorer={blockExplorer}
    fontSize={fontSize}
  />

  ~ Features ~

  - Provide ensProvider={mainnetProvider} and your address will be replaced by ENS name
              (ex. "0xa870" => "user.eth")
  - Provide blockExplorer={blockExplorer}, click on address and get the link
              (ex. by default "https://etherscan.io/" or for xdai "https://blockscout.com/poa/xdai/")
  - Provide fontSize={fontSize} to change the size of address text
*/

const { Text } = Typography;

export const ellipseAddress = ( address = "", width = 8 ) => `${address.slice(0, width)}...${address.slice(-width)}`;

const blockExplorerLink = (address, blockExplorer) => `${blockExplorer || "https://etherscan.io/"}${"address/"}${address}`;

export default function Address(props) {

  const address = props.value || props.address;

  const ens = useLookupAddress(props.ensProvider, address);

  if (!address) {
    return (
      <span>
        <Skeleton avatar paragraph={{ rows: 1 }} />
      </span>
    );
  }

  let displayAddress = address.substr(0, 6);

  if (ens && ens.indexOf("0x")<0) {
    displayAddress = ens;
  } else if (Number(props.size) >= 2) {
    displayAddress = ellipseAddress(address, props.size);
  } else if (props.size === "long") {
    displayAddress = address;
  }

  const etherscanLink = blockExplorerLink(address, props.blockExplorer);
  if (props.minimized) {
    return (
      <a style={{ color: activeColor }} target={"_blank"} href={etherscanLink} rel="noopener noreferrer">
        <Blockies seed={address.toLowerCase()} size={22} scale={2} />
      </a>
    );
  }

  let text;
  if (props.onChange) {
    text = (
      <Text editable={{ onChange: props.onChange }} copyable={{ text: address }}>
        <a style={{ color: activeColor }} target={"_blank"} href={etherscanLink} rel="noopener noreferrer">
          {displayAddress}
        </a>
      </Text>
    );
  } else {
    text = (
      <Text copyable={{ text: address }}>
        <a style={{ color: activeColor }} target={"_blank"} href={etherscanLink} rel="noopener noreferrer">
          {displayAddress}
        </a>
      </Text>
    );
  }

  return (
    <span>
      { !props.disableBlockies && <span style={{ verticalAlign: "middle", marginBottom: -5, display: "inline-block"}}>
        <Blockies seed={address.toLowerCase()} size={8} scale={props.fontSize?props.fontSize/7:4}/>
      </span> }
      <span style={{ verticalAlign: "middle", fontSize: props.fontSize ? props.fontSize : 28, zIndex: 12 }}>{text}</span>
    </span>
  );
}
