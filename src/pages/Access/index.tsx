import React, { useEffect,useCallback } from 'react';
import './index.less';
import { Button, Form, Input, InputNumber, TimePicker, Select} from 'antd'
import { MinusCircleOutlined,PlusOutlined } from '@ant-design/icons'
import useRequest from '@umijs/use-request';
import { useHistory } from 'react-router-dom';
import BreadNav from '../../components/BreadNav';

const { RangePicker } = TimePicker;
const { Option } = Select;

const layout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 7 },
};

enum Week {
  '一' = 1,
  '二' = 2,
  '三' = 3,
  '四' = 4,
  '五' = 5,
  '六' = 6,
  '日' = 7
}


const formItemLayoutWithOutLabel = {
  wrapperCol: {
    span: 7,
    offset: 9
  },
};

const BusinessTime = () => {
  return (
    <Form.List name="businessTime">
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map((field, index) => (
              <Form.Item
                {...(index === 0 ? layout : formItemLayoutWithOutLabel)}
                label={index === 0 ? '营业时间' : ''}
                required={ true }
                key={ field.key }
              > 
                <Form.Item
                  { ...field }
                  name = "week"
                  key = { index + 'week' }
                  validateTrigger={['onBlur']}
                  style = {{ display:'inline-block' ,width: '30%'}}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input Week.",
                    },
                  ]}
                >
                    <Select placeholder="选择星期">
                      {
                        Array.from({ length: 7 }).fill(0).map((_,i)=>
                          (<Option value={ i+1 } key={ i }>星期{ Week[i+1] }</Option>)
                        )
                      }
                    </Select>
                </Form.Item>
                <Form.Item
                  { ...field }
                  name = "time"
                  key = { index + 'time' }
                  style = {{ display:'inline-block', width: '60%'}}
                  validateTrigger={['onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please input time.",
                    },
                  ]}
                >
                  <RangePicker  picker="time" />
                </Form.Item>
                {fields.length > 1 && (
                  <MinusCircleOutlined
                    className="dynamic-delete-button"
                    onClick={() => {
                      remove(field.name);
                    }}
                  />
                )}
              </Form.Item>
            ))}
            <Form.Item
                wrapperCol ={ { span: 10, offset: 9 } }
              >
                <Button
                  type="dashed"
                  onClick={() => {
                    add();
                  }}
                  style={{ width: '60%', marginTop: '-5px' }}
                >
                  <PlusOutlined /> Add field
                </Button>
              </Form.Item>
          </div>
        );
      }}
    </Form.List>
  )
}




const AccessForm = ({ form, run }) => {
  const onFinish = (value) => {
      console.log(value)
      run(value)
  }
  return (
    <Form
      { ...layout }
      name="basic"
      form = { form }
      onFinish = { onFinish }
      initialValues = { { businessTime:[{}] }}
    >
      <Form.Item
        label="食堂名称"
        name="name"
        rules={[{ required: true, message: '' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="食堂电话"
        name="phone"
        rules={[{ required: true, message: '' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="负责人"
        name="principalMan"
        rules={[{ required: true, message: '' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="食堂地址"
        name="address"
        rules={[{ required: true, message: '' }]}
      >
        <Input />
      </Form.Item>
      <BusinessTime />
      <Form.Item
        label="食堂面积"
        name="area"
        rules={[{ required: true, message: '' }]}
      >
        <InputNumber min={ 1 }/>
      </Form.Item>
      <Form.Item
        label="最大容纳人数"
        name="accommodateNum"
        rules={[{ required: true, message: '' }]}
      >
        <InputNumber min={ 1 }/>
      </Form.Item>
      <Form.Item
        label="员工人数"
        name="workerNum"
        rules={[{ required: true, message: '' }]}
      >
        <InputNumber min={ 1 } />
      </Form.Item>
    </Form>
  )
}


const Access = () => {
  const history = useHistory()
  const [ form ] = Form.useForm();
  const confirm =  useCallback(() => form.submit(),[form])
  const { run, loading } = useRequest(data => ({
    url: '/api/admin/dining',
    method: 'post',
    data,
  }),{
    manual:true
  })
  return( 
    <div className="page-content">
      <BreadNav title="申请食堂" confirm = { confirm }  loading = { loading }/>
      <main className="form-content">
        <AccessForm  form={ form }  run = { run } />
      </main>  
    </div>
  )
};

export default Access;