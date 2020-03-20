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
                    exact: true,
                    name: '账号信息管理',
                    icon: getIcon('HomeOutlined'),
                    component: lazy(() => import('../pages/Home')),
                },
                {
                    path: '/access',
                    comment: '接入',
                    component: lazy(() => import('../pages/Access')),
                },
                {
                    path: '/goods',
                    name: '商品列表',
                    icon: getIcon('TaobaoCircleOutlined'),
                    component: lazy(() => import('../pages/Home')),
                },
                {
                    path: '/orders',
                    name: '订单列表',
                    icon: getIcon('AppstoreOutlined'),
                    component: lazy(() => import('../pages/Home')),
                },
                {
                    path: '/inventories',
                    name: '库存列表',
                    icon: getIcon('DropboxOutlined'),
                    component: lazy(() => import('../pages/Home')),
                },
                {
                    path: '/cart',
                    name: '购物车',
                    icon: getIcon('ShoppingCartOutlined'),
                    component: lazy(() => import('../pages/Home')),
                },
            ]
        }]
    }
]