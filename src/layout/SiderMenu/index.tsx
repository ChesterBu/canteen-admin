import React, { useEffect, useState, useMemo, Suspense, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Row } from 'antd';
import { useStore } from '../../store/index';
import { useObserver } from 'mobx-react';
import { CarOutlined } from '@ant-design/icons'
import { IRoute } from '../../routers/config';
import './index.less'

const renderMenuItem = (target:IRoute[]) =>{
    return target
        .filter( i => i.path && i.name)
        .map( subMenu => {
            if (!!subMenu?.childRoutes?.find(child => child.path && child.name)){
                return (
                    <Menu.SubMenu
                        key={ subMenu.path }
                        title={
                            <div>
                                {subMenu.icon && <subMenu.icon />}
                                <span>{subMenu.name}</span>
                            </div>
                        }
                    >
                            { renderMenuItem(subMenu.childRoutes) }
                    </Menu.SubMenu>
                )
            }
            return (
                <Menu.Item key={subMenu.path}>
                    <Link to={subMenu.path}>
                        <span>
                            { subMenu.icon && <subMenu.icon /> }
                            <span>{subMenu.name}</span>
                        </span>
                    </Link>
                </Menu.Item>
            )
        } )
}





export default function SiderMenu ({ routes }) {
    const { pathname } = useLocation();
    const store = useStore()
    const [openKeys, setOpenKeys] = useState([]);
    const selectkeys = useCallback(() => {
        const list = pathname.split('/').splice(1);
        return list.map((_, index) => `/${list.slice(0, index + 1).join('/')}`);
    },[pathname])
    useEffect(()=>{
        setOpenKeys(selectkeys())
    }, [selectkeys]);

    return useObserver( ()=> (
        <Layout.Sider 
            trigger={null} 
            collapsible 
            collapsed={ store.collapsed }
            className="main-left-slider"
        >
            <Link to="/">
                <Row align="middle" className="main-logo">
                    <CarOutlined  style={{ color: '#13e367' }}/>
                    {!store.collapsed && <span className="app-name">餐厅管理系统</span>}
                </Row>
            </Link>
            <Menu 
                theme="dark" 
                mode="inline"
                className="main-menu"
                openKeys={ openKeys }
                onOpenChange={ setOpenKeys }
                selectedKeys={ selectkeys() }
            >
                { renderMenuItem(routes) }
            </Menu>
        </Layout.Sider>
    ))
}