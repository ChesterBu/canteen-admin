import React,{ memo } from 'react';
import { PageHeader, Button } from 'antd';
import { useHistory } from 'react-router-dom';

const BreadNav = ({ title, confirm, loading }) => {
    const history = useHistory()
    const goBack = history.goBack
    return (
        <PageHeader
            ghost={false}
            onBack={ goBack }
            title={ title }
            extra={[
                <Button 
                    type="primary" 
                    onClick = { confirm }
                    key = { 1 } 
                    loading={ loading }>
                    确定
                </Button>,
                <Button onClick={ goBack } key = { 2 } >
                    取消
                </Button>
            ]}
        />
    )
}

export default memo(BreadNav) 