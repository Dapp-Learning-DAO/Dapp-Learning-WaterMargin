import React from "react";
import { PageHeader } from "antd";

// displays a page header

export default function Header(props) {
  return (
    <div>
      <a href="https://dapp-learning.com" target="_blank" rel="noopener noreferrer">
        <PageHeader
          title="⛵️ WaterMargin"
          subTitle="🚀 by Dapp-Learning DAO"
          style={{ cursor: "pointer" }}
        />
      </a>
      {props.children}
    </div>
  );
}
