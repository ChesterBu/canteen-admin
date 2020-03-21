import React,{ useEffect, useState, memo } from 'react';
import './index.less';
import useRequest from '@umijs/use-request';
import { Table, Tag, Button, Row, Col, Modal, Form, Input, notification, message } from 'antd';
import { STATUSCOLOR, STATUS } from '../../const';
import moment from 'moment';


const columns = [
  {
    title: '物资名称',
    dataIndex: 'goodName',
    width: 200
  },
  {
    title: '物资编号',
    dataIndex: 'goodNo',
    width: 200,
  },
  {
    title: '物资状态',
    dataIndex: 'status',
    width: 200,
    render: status =>  <Tag color= { STATUSCOLOR[status]}>{ STATUS[status] }</Tag>
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: 200,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
    render: createTime => <span> { moment(createTime).format('YYYY-MM-DD')}</span>
  },
];

const InventoryAdd = memo<{ visible:boolean, toggle: Function }>(( { visible, toggle } ) => {
  const [ form ] = Form.useForm();
  const { run } = useRequest(data => ({
    url: '/api/good/add',
    method: 'post',
    data,
  }),{
    manual:true
  })
  const onFinish = async value =>{
    let res = await run(value)
    if (res.ret) {
      notification.success({
        message:`物资:${value.goodName}添加成功`,
        description: `编号为${res.data}`,
      });
      toggle(false)
    } else {
      message.error(res.errorMsg, 2)
    }
  }
  return (
    <Modal
        title="添加物资"
        visible={ visible }
        onOk={ form.submit }
        onCancel={ () => toggle(false) }
    >
      <Form
        name="basic"
        labelCol = {{ span: 4 }}
        wrapperCol={{ span: 18 }}
        form = { form }
        onFinish={ onFinish }
      >
          <Form.Item
            label="物资名称"
            name="goodName"
            rules={[{ required: true, message: 'Please input your goodName' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="单位"
            name="unit"
            rules={[{ required: true, message: 'Please input your unit!' }]}
          >
            <Input />
          </Form.Item>
      </Form>
    </Modal>
  )
})


const InfoPane = () => {
  const { data, loading, run } = useRequest((params) => ({
    url: '/api/good/all',
    method: 'get',
    params,
  }))
  const [ visible, toggle] = useState(false)
  useEffect(()=>{
    run({})
  },[visible])
  return(
    <>
      <Row style={ { marginBottom: 16 } }>
        <Col  flex="auto"></Col>
        <Col  flex="88px">
          <Button
            type="primary" 
            onClick ={ () => { toggle(true) } }
          > 
            添加物资信息
          </Button>
        </Col>
      </Row>
      <Table
        rowKey={ (_,index) => index }
        loading={ loading } 
        columns={ columns }
        dataSource = { data?.data?.data } 
      />
      <InventoryAdd  visible = { visible } toggle = { toggle } />
    </>
  )
}

const Inventory = () => {
  return( 
    <div className="page-content">
      <InfoPane />
    </div>
  )
};

export default Inventory;