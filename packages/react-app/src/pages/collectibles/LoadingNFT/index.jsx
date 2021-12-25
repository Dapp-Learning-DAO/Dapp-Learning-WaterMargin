import React from "react";
import "./index.css"

export const LoadingNFT = (props) => {
  return (
    <div id="loading-nft-center-absolute" {...props}>
      <div className="object" id="first_object"></div>
      <div className="object" id="second_object"></div>
      <div className="object" id="third_object"></div>
      <div style={{ position: "absolute", bottom: -20, left: 5 }}>WaterMargin NFT loading...</div>
    </div>)
}