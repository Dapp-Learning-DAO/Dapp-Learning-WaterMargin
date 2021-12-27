import React from "react";
import "./index.css"
import panlaoshi from "./pan.gif"

export const LoadingNFT1 = (props) => {
  return (
    <div id="loading-nft-center-absolute" {...props}>
      <div className="object" id="first_object"></div>
      <div className="object" id="second_object"></div>
      <div className="object" id="third_object"></div>
      <div style={{ position: "absolute", bottom: -20, left: 5 }}>WaterMargin NFT loading...</div>
    </div>)
}

export const LoadingNFT = () => {
  return (
    <div style={{ margin: "20px auto" }}>
      <img src={panlaoshi} style={{ borderRadius: 5 }} alt="" />
      <div style={{ marginTop: -26, fontSize: 16, color: "white" }}>大朗，来把药喝了，你的NFT一会儿就好！</div>
    </div>)
}