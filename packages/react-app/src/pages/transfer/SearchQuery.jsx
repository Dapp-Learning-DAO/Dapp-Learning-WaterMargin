import React, { Dispatch, useEffect, useMemo, useState } from "react";
import { Dictionary, filter, groupBy, keys, map, orderBy } from "lodash";
import { Select } from "antd";
const { Option } = Select;

export const SearchQuery = ({ list, setData, assets }) => {
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
      label: "按时间降序",
      value: "id-desc",
    },
    {
      label: "按时间升序",
      value: "id-asc",
    },
  ]

  useEffect(() => {
    const ownerList = owner ? filter(list, item => item?.from === owner || item?.to === owner) : list
    const nameList = tokenId ? filter(ownerList, item => item?.tokenId["_hex"] === tokenId) : ownerList
    let sortList;
    if (sort) {
      if(sort === "id-desc"){
        sortList = nameList?.sort((a, b)=>parseInt(a?.tokenId["_hex"]) - parseInt(b?.tokenId["_hex"]));
      }else{
        sortList = nameList?.sort((a, b)=>parseInt(b?.tokenId["_hex"]) - parseInt(a?.tokenId["_hex"]));
      }
      console.log(sort, "sort?.split("-")[0]")
      //sortList = orderBy(nameList, [sort?.split("-")[0]], [sort?.split("-")[1]]);
    } else {
      sortList = nameList
    }
    setData(sortList)
  }, [list, owner, tokenId, sort])

  return (
    <div style={{
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      marginBottom: 20
    }}>
      <Select
        showSearch
        style={{ width: 400 }}
        allowClear
        placeholder="用户地址"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, owner: val }))
        }}
        onSearch={onSearch}
        filterOption={(input, option) =>
          option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {addressList?.map(item => <Option key={item} value={item}>{item}</Option>)}
      </Select>
      { assets && <Select
        style={{ width: 200, marginLeft: 20 }}
        allowClear
        placeholder="好汉姓名"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, tokenId: val }))
        }}
      >
        {nameList?.map(item => <Option key={item} value={item}>{`${assets[parseInt(item)]?.description}`}</Option>)}
      </Select>}
      {/* <Select
        style={{ width: 150, marginLeft: 20 }}
        allowClear
        placeholder="是否收藏"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, sale: val }))
        }}
      >
        {map(keys(saleList), item => <Option key={item} value={item}>{item === "true" ? "未收藏" : "已收藏"}</Option>)}
      </Select> */}
      <Select
        style={{ width: 120, marginLeft: 20 }}
        allowClear
        placeholder="排序"
        optionFilterProp="children"
        onChange={(val) => {
          setList((pre) => ({ ...pre, sort: val }))
        }}
      >
        {map(sortList, item => <Option key={item.value} value={item?.value}>{item?.label}</Option>)}
      </Select>
    </div>
  )
}