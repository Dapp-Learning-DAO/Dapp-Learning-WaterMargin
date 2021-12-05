import React from "react";
import { PageHeader } from "antd";

// displays a page header

export default function Header() {
  return (
    <a href="https://watermargin.dapp-learning.com" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="⛵️ WaterMargin"
        subTitle="🚀 by Dapp-Learning DAO"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
