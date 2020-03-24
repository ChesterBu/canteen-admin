import React, { useEffect, useState } from 'react';
import './index.less';
import useRequest from '@umijs/use-request';
import { Table, Tag, Button, Row, Col, notification, message } from 'antd';
import { ORDERSTATUS, ORDERCOLOR } from '../../const';
import moment from 'moment';

enum PAYSTATUS {
  '未结算' = 1,
  '已结算' = 2
}

const columns: any[] = [
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
  const { data, loading, run } = useRequest(params => ({
    url: `/api/order/all`,
    method: 'get',
    params,
  }))
  const {  run: pay } = useRequest(params => ({
    url: `/api/order/pay`,
    method: 'put',
    params,
  }),{
    manual: true
  })

  const [ number, setNumber] = useState(0)
  const [ selectedRows, setSelect ] = useState([])
  const onChange = (_, selectedRows: any[]) => {
    setNumber(selectedRows.reduce((prev,cur)=> prev + cur.totalAmount, 0))
    setSelect(selectedRows)
  }
  const settle = async () => {
    let res  =  await pay({
      orders: selectedRows.map(i => i.orderNo).join(',')
    })
    if (res.ret) {
      notification.success({
        message:`结算成功`
      });
      run(null)
    } else {
      message.error(res.errorMsg, 2)
    }
  }
  return( 
    <div className="page-content">
      <Row className="query">
        <Col  flex="auto">
          <h1>
            总金额: 
            <span style={ { color: 'red' } }>
              { number }
            </span>
          </h1>
        </Col>
        <Col  flex="88px">
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
          ...rowSelection,
        }}
        rowKey={ (_,index) => index }
        loading={ loading } 
        columns={ columns }
        scroll={{ x: 1300 }}
        dataSource = { data?.data?.data } 
      />
    </div>
  )
};

export default Audit;