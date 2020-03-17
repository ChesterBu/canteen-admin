import React from 'react';
import './index.less';
import useRequest from '@umijs/use-request';
import { Table, Tabs } from 'antd';
const { TabPane } = Tabs;


const diningRoomColumns = [
  {
    title: '食堂id',
    dataIndex: 'id',
    width: 250,
  },
  {
    title: '食堂名称',
    dataIndex: 'name',
    width: 250,
  },
  {
    title: '食堂电话',
    dataIndex: 'phone',
    width: 250,
  },
  {
    title: '负责人',
    dataIndex: 'principalMan',
    width: 250,
  }
];

const financesColumns = [
  {
    title: '财务部id',
    dataIndex: 'id',
    width: 250,
  },
  {
    title: '财务部名称',
    dataIndex: 'name',
    width: 250,
  },
  {
    title: '联系方式',
    dataIndex: 'phone',
    width: 250,
  },
  {
    title: '负责人',
    dataIndex: 'principalMan',
    width: 250,
  },
]

const suppliersColumns = [
  {
    title: '供应商id',
    dataIndex: 'id',
    width: 250,
  },
  {
    title: '供应商名称',
    dataIndex: 'name',
    width: 250,
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    width: 250,
  },
  {
    title: '负责人',
    dataIndex: 'principalMan',
    width: 250,
  },
]

const tables = [
  {
    dataSource: 'diningRooms',
    columns: diningRoomColumns
  },
  {
    dataSource: 'finances',
    columns: financesColumns
  },
  {
    dataSource: 'suppliers',
    columns: suppliersColumns
  },
]

const Home = () => {
  const { data, loading } = useRequest('/api/admin/info')
  return( 
    <div className="page-content">
      <Tabs defaultActiveKey="0" >
      {
        tables.map((v, i)=>(
          <TabPane tab="Tab 0" key={ i.toString() }>
            <Table
              key = { i }
              rowKey={ (_,index) => index }
              loading={ loading } 
              columns={ v.columns }
              dataSource = { data?.data?.[v.dataSource] } 
            />
          </TabPane>
        ))
      }
      </Tabs>
    </div>
  )
};

export default Home;