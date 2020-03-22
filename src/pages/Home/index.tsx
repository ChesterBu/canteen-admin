import React, { useEffect } from 'react';
import './index.less';
import useRequest from '@umijs/use-request';
import { Table, Tabs, Tag, Button, Row, Col } from 'antd';
import { useHistory } from 'react-router-dom';
import { STATUS, STATUSCOLOR } from '../../const';
const { TabPane } = Tabs;


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
  },
  {
    title: 'Action',
    key: 'action',
    width: 200,
    render: (_, record) => (
      <span>
        <a style={{ marginRight: 16 }}>详情</a>
        { record.status === 1 && <a style={{ marginRight: 16 }}>删除</a> }
        <a>修改</a>
      </span>
    ),
  },
];


const tables = ['食堂','供应商','财务部']

const InfoPane = ({ name, i }) => {
  const { data, run, loading } = useRequest((params) => ({
    url: '/api/admin/account/all',
    method: 'get',
    params,
  }),{
    manual:true
  })
  const history = useHistory()
  useEffect(()=>{
      run({ role: i + 1 })
  },[])
  return(
    <>
      <Row className="query">
        <Col  flex="auto"></Col>
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
        dataSource = { data?.data } 
      />
    </>
  )
}


const Home = () => {
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

export default Home;