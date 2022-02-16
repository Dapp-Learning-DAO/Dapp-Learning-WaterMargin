import { useState } from "react";
import { usePoller } from "eth-hooks";

export const useIsExpire = (expireTime) => {
  const [isExpire, setIsExpire] = useState();
  const load = async () => {
    if(expireTime === undefined || expireTime === "") return
    const time = new Date(Number(expireTime) * 1000).valueOf();
    const diff = time - new Date().valueOf()
    setIsExpire(diff <= 0)
  };

  usePoller(load, 1000);
  return isExpire;
}
