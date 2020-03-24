import  { LazyExoticComponent, lazy, FC } from 'react';
import BlankLayout from '../layout/BlankLayout/index';

export interface IRoute {
    redirect?: string
    exact?: boolean
    strict?: boolean
    icon?: FC<any> | LazyExoticComponent<FC<any>>
    name?: string,
    path: string
    component: FC<any> | LazyExoticComponent<FC<any>>
    childRoutes?: IRoute[]
    // 注释
    comment?:string
}

const getIcon = (type: string) => lazy(async () => {
    const icons = await import('@ant-design/icons')
    return {
        default: icons[type]
    }
})




export const config: IRoute[] = [
    {
        path: '/',
        component: BlankLayout,
        childRoutes:[{
            path: '/login', // 路由路径
            name: '登录页', // 菜单名称 (不设置,则不展示在菜单栏中）
            icon: getIcon('SettingOutlined'), // 菜单图标
            component: lazy(() => import('../pages/Login')), // 懒加载 路由组件
        },{
            path: '/',
            component: lazy(()=> import('../layout/BasicLayout')), // 基本布局
            childRoutes: [
                {
                    path: '/home',
                    name: '账号管理',
                    icon: getIcon('HomeOutlined'),
                    component: lazy(() => import('../pages/Home')),
                },
                {
                    // 接入页面
                    path: '/access',
                    component: lazy(() => import('../pages/Access')),
                },
                {
                    path: '/inventories',
                    name: '物资管理',
                    icon: getIcon('DropboxOutlined'),
                    component: lazy(() => import('../pages/Inventory')),
                },
                {
                    path: '/goods',
                    name: '采购管理',
                    icon: getIcon('TaobaoCircleOutlined'),
                    component: lazy(() => import('../pages/Goods')),
                },
                {
                    path: '/orders',
                    name: '订单管理',
                    icon: getIcon('AppstoreOutlined'),
                    component: lazy(() => import('../pages/Order')),
                },
                {
                    path: '/audit',
                    name: '审批订单',
                    icon: getIcon('SlidersOutlined'),
                    component: lazy(() => import('../pages/Audit')),
                },
            ]
        }]
    }
]