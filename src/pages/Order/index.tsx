import React, { useEffect, useState } from 'react';
import './index.less';
import useRequest from '@umijs/use-request';
import { Table, Tag, Button, Popconfirm, InputNumber, Row, Col, Input, Select } from 'antd';
import { ORDERSTATUS, ORDERCOLOR } from '../../const';
import moment from 'moment';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { useStore } from '../../store/index';
const { Search } = Input 
const { Option } = Select


let columns: any[] = [
  {
    title: '物资编号',
    dataIndex: 'orderItems',
    ellipsis: true,
    width: 200,
    render: orderItems => <span> { orderItems?.goodDto?.goodNo }</span>
  },
  {
    title: '物资名称',
    dataIndex: 'orderItems',
    width: 100,
    render: orderItems => <span> { orderItems?.goodDto?.goodName }</span>
  },
  {
    title: '预定量',
    dataIndex: 'orderItems',
    width: 100,
    render: orderItems => <span> { orderItems?.orderQuantity }</span>
  },
  {
    title: '实际量',
    dataIndex: 'orderItems',
    width: 100,
    render: orderItems => <span> { orderItems?.realQuantity }</span>
  },
  {
    title: '单位',
    dataIndex: 'orderItems',
    width: 100,
    render: orderItems => <span> { orderItems?.unit }</span>
  },
  {
    title: '单价',
    dataIndex: 'orderItems',
    width: 100,
    render: orderItems => <span> { orderItems?.unitPrice }</span>
  },
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    width: 200,
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
    width: 180,
    render: createTime => <span> { moment(createTime).format('YYYY-MM-DD')}</span>
  },
  {
    title: '订单状态',
    dataIndex: 'status',
    width: 100,
    render: status =>  <Tag color= { ORDERCOLOR[status]}>{ ORDERSTATUS[status] }</Tag>
  },
  {
    title: '订单金额',
    dataIndex: 'totalAmount',
    width: 200
  },
];

const Order = () => {
  const { role } = useStore();
  const [ query, setQuery ] = useState({
    diningId:'',
    orderNo: '',
    supplierId: '',
    status: '',
  });
  const { data, loading, run: fetchList, pagination } = useRequest((params) => ({
    url: `/api/order/all`,
    method: 'get',
    params:{
      ...params,
      ...query,
    },
  }),{
    refreshDeps:[ query ],
    paginated: true,
    formatResult: (res) => res.data,
  })
  
  const supplierCol = [
    {
      title: '食堂名称',
      dataIndex: 'diningDto',
      width: 200,
      render: diningDto => <a>{ diningDto.name }</a>,
    },
    {
      title: '食堂id',
      dataIndex: 'diningDto',
      width: 200,
      render: diningDto => <a>{ diningDto.id }</a>,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      render: (_, row) => {
        const { run } = useRequest((params) => ({
          url: `/api/order/status`,
          method: 'post',
          params,
        }),{
          manual:true
        })
        const dispatch = () => {
          run({
            status: 2,
            orderNo:row.orderNo
          }).then(() => {
            fetchList(null);
          })
        }
        return (
           <Button onClick={ dispatch } disabled={ row.status !== 1 }>发货</Button>
        )
      }
    },
  ]
  const diningCol = [
    {
      title: '供应商名称',
      dataIndex: 'supplierDto',
      width: 200,
      render: supplierDto => <a>{ supplierDto.name }</a>,
    },
    {
      title: '供应商id',
      dataIndex: 'supplierDto',
      width: 200,
      render: supplierDto => <a>{ supplierDto.id }</a>,
    },
    {
      title: '操作',
      fixed: 'right',
      width: 200,
      render: (_, row) => {
        const [ realRecive, setRecive ] = useState(1)
        const { run } = useRequest( data => ({
          url: `/api/order/status`,
          method: 'post',
          data,
        }),{
          manual:true
        })
        const dispatch = () => {
          run({
            status: 3,
            realRecive,
            orderNo:row.orderNo
          }).then(()=>{
            fetchList(null)
          })
        }
        return (
          <Popconfirm 
            title={ 
              <span>
                实际收货: <InputNumber min = { 1 }  value = { realRecive } onChange={ setRecive } size="small" />
              </span>
            }
            icon ={ <CheckCircleTwoTone twoToneColor="#52c41a" /> } 
            onConfirm = { dispatch }
          >
            <Button disabled={ row.status !== 2 }>收货</Button>
          </Popconfirm>
        )
      }
    }
  ]
  useEffect(()=>{
    if ( role === 1) {
      columns = [diningCol[0], diningCol[1], ...columns, diningCol[1]]
    } else if (role === 2){
      columns = [supplierCol[0], supplierCol[1],  ...columns, supplierCol[1]]
    }
    return () => {
      columns = columns.slice(2, -1)
    }
  },[])
  return( 
    <div className="page-content">
      <Row style={ { marginBottom: 16 } }>
        <Col  flex="auto">
        <Search
              placeholder="输入订单号查找"
              onSearch={ value => setQuery({
                ...query,
                orderNo: value
              }) }
              style={{ width: 200, marginLeft:10 }}
        />
        {
          role === 2 && 
          <Search
            placeholder="输入食堂ID查找"
            onSearch={ value => setQuery({
              ...query,
              diningId: value
            })}
            style={{ width: 200, marginLeft:10 }}
          />
        }
        {
          role === 1 &&  
          <Search
            placeholder="输入供应商ID查找"
            onSearch={ value => setQuery({
              ...query,
              supplierId: value
            }) }
            style={{ width: 200, marginLeft:10}}
          />
        }

        <Select 
          style={{ width: 120, marginLeft:10 }} 
          onChange={ value => setQuery({
            ...query,
            status: value as any
          })}
          placeholder="订单状态"
        >
          <Option value={ 1 }>未结算</Option>
          <Option value={ 2 }>已结算</Option>
        </Select>
        </Col>
      </Row>
      <Table
        rowKey={ (_,index) => index }
        loading={ loading } 
        columns={ columns }
        scroll={{ x: 1300 }}
        dataSource = { data?.data }
        pagination = { pagination }
      />
    </div>
  )
};

export default Order;