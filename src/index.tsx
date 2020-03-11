import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN';
import AppRouter from './routers/AppRouter';
import { StoreProvider } from './store/index';

function App () {
    return (
        <ConfigProvider locale={ zhCN }>
            <StoreProvider>
                <AppRouter />
            </StoreProvider>
        </ConfigProvider>
    )
}

ReactDOM.render(
    <App/>, 
    document.getElementById('root')
);

