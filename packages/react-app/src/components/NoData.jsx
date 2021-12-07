import React from "react";
import { Empty } from "antd";

export const NoData = (props) => {
  return (
    <div style={{ height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Empty {...props}/>
    </div>
  );
}