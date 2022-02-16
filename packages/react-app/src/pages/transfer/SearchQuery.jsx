import React, { useEffect, useMemo, useState } from "react";
import { Select } from "antd";
const { Option } = Select;

export const SearchQuery = ({ list, setData, assets, setPageNo }) => {
  const [{
    sort,
    owner,
    tokenId
  }, setList] = useState({
    sort: "",
    owner: "",
    tokenId: ""
  })

  const onSearch = (val) => {
    setList((pre) => ({ ...pre, owner: val }))
  }

  const addressList = useMemo(() => {
    const data = [];
    for (let i = 0; i < list?.length; i++) {
      data.push(list[i].from)
      data.push(list[i].to)
    }
    return [...new Set(data)]
  }, [list?.length])

  const nameList = useMemo(() => {
    const data = [];
    for (let i = 0; i < list?.length; i++) {
      data.push(list[i].tokenId["_hex"])
    }
    return [...new Set(data)]
  }, [list?.length])

  const sortList = [
    {
      label: "Reverse order",
      value: "id-desc",
    },
    {
      label: "Positive order",
      value: "id-asc",
    },
  ]

  useEffect(() => {
    const ownerList = owner ? list?.filter(item => item?.from === owner || item?.to === owner) : list
    const nameList = tokenId ? ownerList?.filter(item => item?.tokenId["_hex"] === tokenId) : ownerList
    let sortList;
    if (sort === "id-desc") {
      sortList = nameList?.sort((a, b) => parseInt(b?.blockNumber) - parseInt(a?.blockNumber))?.filter(item=>assets && assets[parseInt(item.tokenId["_hex"])]?.description);
    } else {
      sortList = nameList?.sort((a, b) => parseInt(a?.blockNumber) - parseInt(b?.blockNumber))?.filter(item=>assets && assets[parseInt(item.tokenId["_hex"])]?.description);
    }
    setData(sortList)
  }, [list, owner, tokenId, sort, assets])

  return (
    <div style={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    }}>
      <Select
        showSearch
        style={{ width: 420 }}
        allowClear
        placeholder="Select The User Address"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, owner: val }))
          setPageNo(1)
        }}
        onSearch={onSearch}
        filterOption={(input, option) =>
          option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {addressList?.map(item => <Option key={item} value={item}>{item}</Option>)}
      </Select>
      {assets && <Select
        style={{ width: 200, marginLeft: 20 }}
        allowClear
        placeholder="Select Name"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, tokenId: val }))
          setPageNo(1)
        }}
      >
        {nameList?.map(item => <Option key={item} value={item}>{`${assets[parseInt(item)]?.description}`}</Option>)}
      </Select>}
      <Select
        style={{ width: 160, marginLeft: 20 }}
        allowClear
        placeholder="Select Time Sort"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, sort: val }))
          setPageNo(1)
        }}
      >
        {sortList?.map(item => <Option key={item.value} value={item?.value}>{item?.label}</Option>)}
      </Select>
    </div>
  )
}