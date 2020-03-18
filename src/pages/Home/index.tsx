import React, { useEffect } from 'react';
import './index.less';
import useRequest from '@umijs/use-request';
import { Table, Tabs, Tag, Button } from 'antd';
const { TabPane } = Tabs;


enum STATUS {
  '正常' = 1,
  '删除' = 2
}
enum STATUSCOLOR {
  'success' = 1,
  'error' = 2
}

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
    render: (text, record) => (
      <span>
        <a style={{ marginRight: 16 }}>详情</a>
        { record.status === 1 && <a style={{ marginRight: 16 }}>删除</a> }
        <a>修改</a>
      </span>
    ),
  },
];


const tables = ['diningRooms','finances','suppliers']

const InfoPane = ({ i }) => {
  const { data, run , loading } = useRequest((params) => ({
    url: '/api/admin/account/all',
    method: 'get',
    params,
  }),{
    manual:true
  })
  useEffect(()=>{
      run({ role: i + 1 })
  },[])
  return(
    <>
      <Button type="primary" style={{ float: 'right' }}>添加账户</Button>
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
            />
          </TabPane>
        ))
      }
      </Tabs>
    </div>
  )
};

export default Home;