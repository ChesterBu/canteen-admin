import React, { useCallback, memo } from 'react';
import './index.less';
import { Button, Form, Input, InputNumber, TimePicker, Select, message, notification} from 'antd'
import { MinusCircleOutlined,PlusOutlined } from '@ant-design/icons'
import useRequest from '@umijs/use-request';
import { useHistory } from 'react-router-dom';
import BreadNav from '../../components/BreadNav';
import moment from 'moment'
import { ROLENAME } from '../../const';
const { RangePicker } = TimePicker;
const { Option } = Select;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 8 },
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
    span: 8,
    offset: 9
  },
};

const BusinessTime = () => (
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
                <Input.Group compact>
                  <Form.Item
                    { ...field }
                    name={[index, 'week']}
                    key = { index + 'week' }
                    validateTrigger={['onBlur']}
                    style = {{ display:'inline-block' ,width: '100px'}}
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "Please input Week.",
                      },
                    ]}
                  >
                    <Select placeholder="选择星期">
                      {
                        Array.from({ length: 7 }).fill(0).map((_,i)=>
                          (<Option value={ i + 1 } key={ i }>星期{ Week[i+1] }</Option>)
                        )
                      }
                    </Select>
                  </Form.Item>
                  <Form.Item
                    { ...field }
                    name={[index, 'time']}
                    key = { index + 'time' }
                    style = {{ display:'inline-block', width: '60%'}}
                    noStyle
                    validateTrigger={['onChange']}
                    rules={[
                      {
                        required: true,
                        message: "Please input time.",
                      },
                    ]}
                  >
                    <RangePicker  picker="time" format="HH:mm" />
                  </Form.Item>
                  {fields.length > 1 && (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => {
                        remove(field.name);
                      }}
                    />
                  )}
                </Input.Group>
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
                  <PlusOutlined /> 添加时间段
                </Button>
              </Form.Item>
          </div>
        );
      }}
    </Form.List>
)

const DiningItem = () => (
  <>
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
  </>
)

const SupplierItme = () =>(
  <>
    <Form.Item
      label="银行卡号"
      name="bankCard"
      rules={[{ required: true, message: '' }]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      label="简介"
      name="introduction"
      rules={[{ required: true, message: '' }]}
    >
      <TextArea rows={4} />
    </Form.Item>
  </>
)


const AccessForm = memo<{ form: any, run:any, role:any }>(({ form, run, role }) => {
  const history = useHistory()
  const DiningSubmit = async (value, businessTime = value.businessTime) => {
      return await run({ ...value, businessTime: businessTime.reduce((prev,val)=>{
          let [start, end] = val.time
          start = moment(start).format('HH:mm')
          end = moment(end).format('HH:mm')
          prev[val.week] = `${start}-${end}`
          return prev
        },{}) 
      })
  }
  const SupplierSubmit = async (value) => await run(value)
  const FinanceSubmit = async (value) => await run(value)

  const role2Submit = [()=>null, DiningSubmit ,SupplierSubmit, FinanceSubmit]

  const role2label = {
    phone: [, '食堂电话', '手机号码' ,'联系方式'],
    address: [, '食堂地址', '供应商地址']
  }
  const onFinish = async (value) => {
      const res = await role2Submit[role](value)
      if (res.ret) {
        notification.success({
          message:`${ROLENAME[role]}:${value.name}添加成功`,
          description:
            `账号为${res.data.account}\n密码为:${res.data.password}`,
          onClose: history.goBack
        });
      } else {
        message.error(res.errorMsg, 2)
      }
  }
  return (
    <Form
      { ...layout }
      name="access"
      form = { form }
      onFinish = { onFinish }
      initialValues = {{ businessTime:[{}] }}
    >
      <Form.Item
        label={`${ROLENAME[role]}名称`}
        name="name"
        rules={[{ required: true, message: '' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={ role2label.phone[role] }
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
      {
        role !== 3 && 
        <Form.Item
          label={ role2label.address[role] }
          name="address"
          rules={[{ required: true, message: '' }]}
        >
          <Input />
        </Form.Item>
      }
      {
        role === 1 && <DiningItem />
      }
      {
        role === 2 && <SupplierItme />
      }
      {
        role !== 1 && 
        <>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ required: true, message: '' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="传真号码"
            name="fax"
            rules={[{ required: true, message: '' }]}
          >
            <Input />
          </Form.Item>
        </>
      }
    </Form>
  )
})



const role2Api = [,'dining', 'supplier', 'finance']

const Access = () => {
  const history = useHistory()
  const { role } =  history.location.state as any
  const [ form ] = Form.useForm();
  const confirm =  useCallback(() => form.submit(),[ form ])
  const { run, loading } = useRequest(data => ({
    url: `/management/api/admin/${role2Api[role]}`,
    method: 'post',
    data,
  }),{
    manual:true
  })
  return( 
    <div className="page-content">
      <BreadNav title={`申请${ROLENAME[role]}`} confirm = { confirm }  loading = { loading }/>
      <main className="form-content">
        <AccessForm  form={ form }  run = { run }  role = { role }/>
      </main>  
    </div>
  )
};

export default Access;