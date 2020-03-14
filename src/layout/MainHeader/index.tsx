import React from 'react';
import { Layout, Dropdown, Menu, Row, Col, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { useObserver } from 'mobx-react';
import { useStore } from '../../store/index';
import { SmileOutlined, LogoutOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import './index.less'
import useRequest from '@umijs/use-request';


const Logout = ({ run, history }) => {
    const Logout = async () => {
        const res: Res = await run()
        if (res.ret) {
            history.push('/')
        } else {
            message.error(res.errorMsg)
        }
    }

    return  (
        <Menu>
            <Menu.Item key="1">
                <span onClick = { Logout }>
                    <LogoutOutlined />
                    &nbsp; 退出登录
                </span>
            </Menu.Item>
        </Menu>
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
          <Col style={{ flex: 1 }}>
                <span onClick={store.toggle}>
                    {
                      store.collapsed ? <MenuUnfoldOutlined className="trigger" /> : <MenuFoldOutlined  className="trigger"/>
                    }
                </span>
          </Col>
          <Col>
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
  