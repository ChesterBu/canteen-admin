import React, { useState } from 'react';
import './index.less';
import useRequest from '@umijs/use-request';
import { Table, Tabs, Tag, Button, Row, Col, Input } from 'antd';
import { useHistory } from 'react-router-dom';
import { STATUS, STATUSCOLOR } from '../../const';
const { TabPane } = Tabs;
const { Search } = Input;

const columns = [
  {
    title: 'account',
    dataIndex: 'account',
    width: 200
  },
  {
    title: 'depentmentId',
    dataIndex: 'depentmentId',
    width: 200,
  },
  {
    title: 'depent',
    dataIndex: 'depent',
    width: 200,
    render: depent => <a>{ depent.name }</a>,
  },
  {
    title: 'principalMan',
    dataIndex: 'principalMan',
    width: 200,
  },
  {
    title: 'status',
    dataIndex: 'status',
    width: 200,
    render: status =>  <Tag color= { STATUSCOLOR[status]}>{ STATUS[status] }</Tag>
  }
];


const tables = ['食堂','供应商','财务部']

const InfoPane = ({ name, i }) => {
  const [ account, setAccount ] = useState('');
  const { data, loading, pagination } = useRequest((params) => ({
    url: '/api/admin/account/all',
    method: 'get',
    params:{
      ...params,
      account,
      role: i + 1 
    },
  }),{
    paginated: true,
    refreshDeps:[ account ],
    defaultPageSize: 15,
    formatResult: (res) => res.data,
  })
  const history = useHistory()
  return(
    <>
      <Row className="query">
        <Col  flex="auto">
        <Search
            placeholder="输入账号查找"
            onSearch={ value => setAccount(value) }
            style={{ width: 200 }}
          />
        </Col>
        <Col  flex="88px">
          <Button
            type="primary" 
            onClick ={ () => { history.push('/access',{ role: i + 1 }) } }
          > 
            添加{ name }
          </Button>
        </Col>
      </Row>
      <Table
        rowKey={ (_,index) => index }
        loading={ loading } 
        columns={ columns }
        pagination = { pagination }
        dataSource = { data?.data }
      />
    </>
  )
}


const Account = () => {
  return( 
    <div className="page-content">
      <Tabs defaultActiveKey="0" >
      {
        tables.map((v, i)=>(
          <TabPane tab={ v } key={ i.toString() }>
            <InfoPane 
              key= { i }
              i = { i }
              name = { v }
            />
          </TabPane>
        ))
      }
      </Tabs>
    </div>
  )
};

export default Account;