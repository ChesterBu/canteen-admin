import React,{ useState, memo, useEffect } from 'react';
import './index.less';
import useRequest from '@umijs/use-request';
import { Table, Tag, Button, Row, Col, Modal, Form, Input, InputNumber, Select, notification, message } from 'antd';
import { STATUSCOLOR, STATUS, ROLEMAP } from '../../const';
import moment from 'moment';
import { useStore } from '../../store/index';
const { Option } = Select;
const { Search } = Input;

export const columns = [
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
  {
    title: '物资状态',
    dataIndex: 'status',
    width: 200,
    render: status =>  <Tag color= { STATUSCOLOR[status]}>{ STATUS[status] }</Tag>
  },
];

export const supplierCol = [
  {
    title: '物资单价',
    dataIndex: 'unitPrice',
    width: 200,
  },
  {
    title: '库存量',
    dataIndex: 'stock',
    width: 200,
  },
]

const actionCol = [
  {
    title: '操作',
    dataIndex: 'action',
    width: 200,
    render: (_) => (
      <span>
        <a style={{ marginRight: 16 }}>删除</a>
      </span>
    ),
  }
]

const InventoryAdd = memo<{ visible:boolean, toggle: Function, refresh: Function }>(( { visible, toggle, refresh } ) => {
  const { role } = useStore()
  const [ form ] = Form.useForm();
  const { run } = useRequest(data => ({
    url: `/api/good/${ROLEMAP[role]}/add`,
    method: 'post',
    data,
  }),{
    manual:true
  })
  const { data, run: getGood, loading } = useRequest(params => ({
    url: `/api/good/admin/all`,
    method: 'get',
    params,
  }),{
    debounceInterval: 500,
    manual: true,
    formatResult: (res) => res.data,
  })
  const getGoodInfo = value => {
      getGood({
        goodNo:value
      })
  }
  const onFinish = async value =>{
    let res = await run(value)
    if (res.ret) {
      notification.success({
        message:`物资:${value.goodName}添加成功`,
        description: `编号为${res.data}`,
      });
      refresh()
      toggle(false)
    } else {
      message.error(res.errorMsg, 2)
    }
  }
  const setForm = (value, { data }) => {
    form.setFieldsValue({
      goodNo: value,
      goodName: data.goodName,
      unit: data.unit
    })
  }
  
  return (
    <Modal
        title="添加物资"
        visible={ visible }
        onOk={ form.submit }
        onCancel={ () => toggle(false) }
        destroyOnClose={ true }
    >
      <Form
        name="basic"
        labelCol = {{ span: 4 }}
        wrapperCol={{ span: 18 }}
        form = { form }
        onFinish={ onFinish }
      >
          {
            role === 2 &&
            <Form.Item
              label="物资编号"
              name="goodNo"
              rules={[{ required: true, message: 'Please input your goodName' }]}
            >
              <Select
                showSearch
                defaultActiveFirstOption = { false }
                showArrow = { false }
                filterOption = { false }
                onSearch = { getGoodInfo }
                onChange = { setForm as any }
                optionLabelProp = "key"
                loading = { loading }
                notFoundContent={ null }
              >
                { 
                  data?.data?.map(d => <Option key={ d.goodNo } value={ d.goodNo } data= { d } >{ d.goodNo }</Option>)
                }
              </Select>
            </Form.Item>
          }
          <Form.Item
            label="物资名称"
            name="goodName"
            rules={[{ required: true, message: 'Please input your goodName' }]}
          >
            <Input disabled={ role ===2 } />
          </Form.Item>
          <Form.Item
            label="单位"
            name="unit"
            rules={[{ required: true, message: 'Please input your unit!' }]}
          >
            <Input disabled={ role ===2 } />
          </Form.Item>
          {
            role === 2 &&
            <>
                <Form.Item
                  label="库存量"
                  name="stock"
                  rules={[{ required: true, message: 'Please input your unit!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="物资单价"
                  name="unitPrice"
                  rules={[{ required: true, message: 'Please input your unit!' }]}
                >
                  <InputNumber min = { 0 } />
                </Form.Item>
            </>
          }
      </Form>
    </Modal>
  )
})


const InventoryList = () => {
  const { role } = useStore()
  const [ goodName, setGoodName ] = useState('');
  const [ goodNo, setGoodNo ] = useState('');
  const { data, loading, run, pagination } = useRequest((params) => ({
    url: `/api/good/${ROLEMAP[role]}/all`,
    method: 'get',
    params:{
      ...params,
      goodName,
      goodNo
    },
  }),{
    refreshDeps:[ goodName,goodNo ],
    paginated: true,
    formatResult: (res) => res.data,
  })
  const [ visible, toggle] = useState(false)
  return(
    <>
      <Row style={ { marginBottom: 16 } }>
        <Col  flex="auto">
          <Search
              placeholder="输入物资名称查找"
              onSearch={ value => setGoodName(value) }
              style={{ width: 200 }}
          />
          <Search
              placeholder="输入物资编号查找"
              onSearch={ value => setGoodNo(value) }
              style={{ width: 200, marginLeft: 20 }}
          />
        </Col>
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
        columns={ columns.concat(role === 2 ? supplierCol : [],actionCol) }
        dataSource = { data?.data } 
        pagination = { pagination }
      />
      <InventoryAdd  visible = { visible } toggle = { toggle } refresh = { run } />
    </>
  )
}

const Inventory = () => {
  return( 
    <div className="page-content">
      <InventoryList />
    </div>
  )
};

export default Inventory;