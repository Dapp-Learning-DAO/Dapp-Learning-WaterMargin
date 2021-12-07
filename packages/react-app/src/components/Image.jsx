import React, { useState } from "react";
import { Image } from "antd";
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

// displays a image

export const NFTImage = (props) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <div className={"imgBox"}>
        <div style={{ height: "100%", cursor: "pointer" }}>
          <Image
            preview={{ visible: false, mask: null }}
            width={"100%"}
            src={props.image}
            onClick={() => setVisible(true)}
          />
        </div>
      </div>
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup preview={{ visible, onVisibleChange: vis => setVisible(vis) }}>
          <Image src={props.image} />
        </Image.PreviewGroup>
      </div>
    </>
  );
}