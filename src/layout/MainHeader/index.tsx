import React, { useState } from 'react';
import { Layout, Dropdown, Menu, Row, Col, message, Modal, Form, Input, notification } from 'antd';
import { useHistory } from 'react-router-dom';
import { useObserver } from 'mobx-react';
import { useStore } from '../../store/index';
import { LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import './index.less'
import useRequest from '@umijs/use-request';



function Password({ visible, toggle }) {
  const [ form ] = Form.useForm();
  const { run } = useRequest(data =>({
    url: '/api/user/password',
    method: 'put',
    data
  }),{ 
    manual:true
  })
  const onFinish = async values => {
     let res =  await run(values) 
     if (res.ret) {
      notification.success({
        message:`修改成功`
      });
      toggle(false)
    } else {
      message.error(res.errorMsg, 2)
    }
  };
  return(  
    <Modal
      title="修改密码"
      visible={ visible }
      onOk={ form.submit }
      onCancel={ () => toggle(false) }
    >
      <Form
        form={ form }
        name="basic"
        onFinish={ onFinish }
      >
        <Form.Item
          label="输入旧密码"
          name="oldPassword"
          rules={[{ required: true, message: 'Please input your  password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="输入新密码"
          name="newPassword"
          rules={[{ required: true, message: 'Please input your  password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="确认新密码"
          name="confirm"
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('The two passwords that you entered do not match!');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>     
    </Modal>
    )
}



const Logout = ({ run, history }) => {
    const logout = async () => {
        const res = await run()
        history.push('/')
    }
    const [visible, toggle] = useState(false)

    return  (
      <>
        <Menu>
             <Menu.Item key="1">
                <span onClick = { () => { toggle(true) } }>
                    <LogoutOutlined />
                    &nbsp; 修改密码
                </span>
            </Menu.Item>
            <Menu.Item key="2">
                <span onClick = { () => logout() }>
                    <LogoutOutlined />
                    &nbsp; 退出登录
                </span>
            </Menu.Item>
        </Menu>
        <Password visible = { visible } toggle = { toggle } />
      </>
    );
} 

const MainHeader = () => {
    const store = useStore();
    const history = useHistory()
    const { run } = useRequest('/api/user/logout',{
        manual: true,
    });
    return useObserver( ()=> (
      <Layout.Header className="main-header">
        <Row style={{ paddingRight: 20 }}>
          <Col flex="auto">
            <span onClick={store.toggle}>
                {
                  store.collapsed ? <MenuUnfoldOutlined className="trigger" /> : <MenuFoldOutlined  className="trigger"/>
                }
            </span>
          </Col>
          <Col flex="120px">
            <Dropdown overlay={ <Logout run={ run } history = { history} /> } trigger={['click', 'hover']} placement="bottomCenter">
              <div className="user-info">
                <span className="user-img" />
                <span className="user-name">{ store.account }</span>
              </div>
            </Dropdown>
          </Col>
        </Row>
      </Layout.Header>
    ));
};

export default MainHeader
  