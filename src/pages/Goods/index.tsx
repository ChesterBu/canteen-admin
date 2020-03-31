import React, { useState } from 'react';
import './index.less';
import { Table, InputNumber, Popconfirm, message, Input } from 'antd';
import { columns, supplierCol } from '../Inventory/index';
import useRequest from '@umijs/use-request';
import { CheckCircleTwoTone } from '@ant-design/icons';
const { Search } = Input

const diningCol = [
  {
    title: '供应商',
    dataIndex: 'supplier',
    width: 200,
    render: (supplier) => (
      <span>
        { supplier?.name }
      </span>
    ),
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 200,
    render: (_, record) => {
      const [ quantity, setQuantity ] = useState(1)
      const { run } = useRequest((data) =>({
        url: '/api/order/dining',
        method: 'post',
        data
      }),{
        manual:true
      }) 
      const purchase = async () => {
        let res = await run({
          quantity,
          goodNo: record.goodNo,
          supplierId: record.supplier.id
        })
        if (res.ret) {
          message.success('购买成功', 5);
        } else {
          message.error(res.errorMsg)
        }
      }
      return (
        <Popconfirm 
          title={ 
            <span>
            输入数量: <InputNumber min = { 1 }  value = { quantity } onChange={ setQuantity } size="small" />
            </span>
          }
          icon ={ <CheckCircleTwoTone twoToneColor="#52c41a" /> } 
          onConfirm = { purchase }
        >
          <a style={{ marginRight: 16 }}>购买</a>
        </Popconfirm>
      )
    }
  }
]



const Goods = () => {
  const [ goodName, setGoodName ] = useState('');
  const { data, loading, pagination } = useRequest((params) => ({
    url: `/api/good/supplier/all`,
    method: 'get',
    params:{
      ...params,
      goodName
    },
  }),{
    paginated: true,
    refreshDeps:[goodName],
    formatResult: (res) => res.data,
  })
  return( 
    <div className="page-content">
      <Search
          placeholder="输入名称/编号查找"
          onSearch={ value => setGoodName(value) }
          style={{ width: 200, marginBottom:10 }}
      />
      <Table
        rowKey={ (_,index) => index }
        loading={ loading } 
        columns={ columns.concat(supplierCol, diningCol as any ) }
        dataSource = { data?.data } 
        pagination = { pagination }
      />
    </div>
  )
};

export default Goods;