import React from "react";
import { PageHeader } from "antd";
import styled from "styled-components"

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  padding: 4em;
  background: papayawhip;
`;

// displays a page header

export default function Header(props) {
  return (
    <div>
      <a href="https://dapp-learning.com" target="_blank" rel="noopener noreferrer">
        <PageHeader
          className="PageHeader"
          title="⛵️ WaterMargin"
          subTitle="🚀 by Dapp-Learning DAO"
          style={{ cursor: "pointer" }}
        />
      </a>
      {props.children}
      {/* <Wrapper>
        <Title>
          Hello World!
        </Title>
      </Wrapper> */}
    </div>
  );
}
