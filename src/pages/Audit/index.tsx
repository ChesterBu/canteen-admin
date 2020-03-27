import React, { useEffect, useState } from 'react';
import './index.less';
import useRequest from '@umijs/use-request';
import { Table, Tag, Button, Row, Col, notification, message, Input, Select} from 'antd';
import { ORDERSTATUS, ORDERCOLOR,PAYSTATUS } from '../../const';
import moment from 'moment';
const { Search } = Input;
const { Option } = Select;




const columns: any[] = [
  {
    title: '食堂名称',
    dataIndex: 'diningDto',
    width: 200,
    render: diningDto => <span>{ diningDto.name }</span>,
  },
  {
    title: '食堂id',
    dataIndex: 'diningDto',
    width: 200,
    render: diningDto => <span>{ diningDto.id }</span>,
  },
  {
    title: '供应商名称',
    dataIndex: 'supplierDto',
    width: 200,
    render: supplierDto => <span>{ supplierDto.name }</span>,
  },
  {
    title: '供应商id',
    dataIndex: 'supplierDto',
    width: 200,
    render: supplierDto => <span>{ supplierDto.id }</span>,
  },
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    ellipsis: true,
    width: 200
  },
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
    title: '结算状态',
    dataIndex: 'payStatus',
    width: 100,
    render: payStatus =>  <Tag color= { ORDERCOLOR[payStatus]}>{ PAYSTATUS[payStatus] }</Tag>
  },
  {
    title: '订单金额',
    dataIndex: 'totalAmount',
    width: 200
  },
];

const rowSelection = {
  getCheckboxProps: record => ({
    disabled: record.payStatus === 2 , // Column configuration not to be checked
    name: record.orderNo,
  }),
};

const Audit = () => {
  const [ query, setQuery ] = useState({
    diningId:'',
    orderNo: '',
    supplierId: '',
    status: '',
  });
  const { data, loading, run, pagination } = useRequest(params => ({
    url: `/api/order/all`,
    method: 'get',
    params:{
      ...params,
      ...query,
    },
  }),{
    paginated:true,
    refreshDeps:[ query ],
    formatResult: (res) => res.data,
  })
  const {  run: pay } = useRequest(params => ({
    url: `/api/order/pay`,
    method: 'put',
    params,
  }),{
    manual: true
  })
  const [ number, setNumber] = useState(0)
  const [ selectedRowKeys, setSelect ] = useState([])
  const onChange = (selectedRowKeys, selectedRows: any[]) => {
    setSelect(selectedRowKeys);
    setNumber(selectedRows.reduce((prev,cur)=> prev + cur.totalAmount, 0))
  }
  const settle = async () => {
    let res  =  await pay({
      orders: selectedRowKeys.join(',')
    })
    if (res.ret) {
      notification.success({
        message:`结算成功`
      });
      run(null)
      setSelect([])
      setNumber(0)
    } else {
      message.error(res.errorMsg, 2)
    }
  }
  return( 
    <div className="page-content">
      <Row className="query">
        <Search
              placeholder="输入订单号查找"
              onSearch={ value => setQuery({
                ...query,
                orderNo: value
              }) }
              style={{ width: 200 }}
        />
        <Search
              placeholder="输入食堂ID查找"
              onSearch={ value => setQuery({
                ...query,
                diningId: value
              })}
              style={{ width: 200, marginLeft:10 }}
        />
        <Search
              placeholder="输入供应商ID查找"
              onSearch={ value => setQuery({
                ...query,
                supplierId: value
              }) }
              style={{ width: 200, marginLeft:10}}
        />
        <Select 
          style={{ width: 120, marginLeft:10 }} 
          onChange={ value => setQuery({
            ...query,
            status: value as any
          })}
          placeholder="结算状态"
        >
          <Option value={ 1 }>未结算</Option>
          <Option value={ 2 }>已结算</Option>
        </Select>
      </Row>
      <Row className="query">
        <Col  flex="auto">
          <h1>
            总金额: 
            <span style={ { color: 'red' } }>
              { number }
            </span>
          </h1>
        </Col>
        <Col  flex="68px">
          <Button
            type="primary" 
            onClick = { settle }
          > 
              结算
          </Button>
        </Col>
      </Row>
      <Table
        rowSelection={{
          type: 'checkbox',
          onChange,
          selectedRowKeys,
          ...rowSelection,
        }}
        rowKey={ row => row.orderNo }
        loading={ loading } 
        columns={ columns }
        scroll={{ x: 1300 }}
        pagination = { pagination }
        dataSource = { data?.data } 
      />
    </div>
  )
};

export default Audit;