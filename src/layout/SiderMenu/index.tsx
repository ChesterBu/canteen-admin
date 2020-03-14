import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Row } from 'antd';
import { useStore } from '../../store/index';
import { useObserver } from 'mobx-react';
import { ApartmentOutlined } from '@ant-design/icons'
import { IRoute } from '../../routers/config';
import './index.less'

const renderMenuItem = (target: IRoute[]) =>{
    const store = useStore()
    return useObserver( () => (
        target
        .filter( i => i.path && i.name)
        .filter( i => i.role === store.role)
        .map( subMenu => (
            <Menu.Item key={ subMenu.path }>
                <Link to={ subMenu.path }>
                    <span>
                        { subMenu.icon && <subMenu.icon /> }
                        <span>{ subMenu.name }</span>
                    </span>
                </Link>
            </Menu.Item>
        ))
    ))
}





export default function SiderMenu ({ routes }) {
    const { pathname } = useLocation();
    const store = useStore()

    const selectkeys = useCallback(() => {
        const list = pathname.split('/').splice(1);
        return list.map((_, index) => `/${list.slice(0, index + 1).join('/')}`);
    },[pathname])

    return useObserver( ()=> (
        <Layout.Sider 
            trigger={ null } 
            collapsible 
            collapsed={ store.collapsed }
            className="main-left-slider"
        >
            <Link to="/home">
                <Row align="middle" className="main-logo">
                    <ApartmentOutlined  style={{ color: '#13e367' }}/>
                    {!store.collapsed && <span className="app-name">{ store.appTitle }</span>}
                </Row>
            </Link>
            <Menu 
                theme="dark" 
                mode="inline"
                className="main-menu"
                selectedKeys={ selectkeys() }
            >
                { renderMenuItem(routes) }
            </Menu>
        </Layout.Sider>
    ))
}