/* eslint-disable import/extensions */
import React from 'react'
import { Spin } from 'antd';
import './index.less'

export default function LoadingPage () {
    return (
        <div className="loading-page">
            <Spin size="large" />
        </div>
    )
}