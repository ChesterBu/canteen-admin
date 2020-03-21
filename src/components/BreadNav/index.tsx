import React,{ memo } from 'react';
import './index.less';
import { Button,Row,Col } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom';

const BreadNav = ({ title, confirm, loading }) => {
    const history = useHistory()
    const goBack = history.goBack
    return (
        <Row className="page-header">
            <Col flex="auto" className="bread-nav">
                <a className="go-back-icon">
                    <ArrowLeftOutlined onClick={ goBack } />
                </a>
                <span className="bread-title">{ title }</span>
            </Col>
            <Col flex="180px" className="header-button">
                <Button type="primary" onClick = { confirm } loading={ loading }>
                    确定
                </Button>
                <Button onClick={ goBack }>
                    取消
                </Button>
            </Col>
        </Row>
    )
}

export default memo(BreadNav) 