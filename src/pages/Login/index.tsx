import React, { SFC } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Checkbox, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import useRequest from '@umijs/use-request';
import { useStore } from '../../store';
import './index.less'



const LoginPage:SFC = () => {
    const [ form ] = Form.useForm();
    const history = useHistory()
    const store = useStore()
    const { loading, run } = useRequest(( data ) => ({
        url: '/management/api/user/login',
        method: 'post',
        data
    }), {
        manual: true,
    });
    const onFinish = async values => {
        const res: Res = await run(values)
        if (res.ret) {
            message.success('登录成功，即将跳转...', 2);
            setTimeout(()=>{
                store.setUser({
                    account:values.account,
                    role: res.data.role
                })
                history.push('/')
            },2000)
        } else {
            message.error(res.errorMsg)
        }
    };
    return (
        <div className="page-login">
            <Form form = { form } onFinish={ onFinish } className="login-form" initialValues = {{ remember:true }}>
            <div className="login-title">欢迎登录餐厅管理系统</div>
                <Form.Item
                    name="account"
                    rules={[
                        {
                            required: true,
                            message: '请输入用户名！',
                        },
                    ]}>
                        <Input 
                            prefix = { <UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} /> }
                            placeholder = "用户名"
                        />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: '请输入密码！',
                        },
                    ]}>
                        <Input.Password 
                            prefix = { <LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} /> }
                            placeholder = "密码"
                        />
                </Form.Item>
                <Form.Item
                    name = "remember"
                    valuePropName = "checked"
                >
                    <Checkbox>记住我</Checkbox>
                </Form.Item>
                <Form.Item>
                    <Button loading={ loading } type="primary" htmlType="submit" className="login-form-button">
                        提交
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default LoginPage