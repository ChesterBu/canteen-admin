import React, { useState } from 'react';
import { Button } from 'antd';

import './index.less';
import useRequest from '@umijs/use-request';

const { loading, run } = useRequest('/api/dining/info', {
  manual: true
}) 
const Home = () => {
  const getDining = async () => {
      const res: Res = await run()
      console.log(res.data)
  } 

  return( 
    <div className="page-home page-content">
      <div>
        <Button
          type="primary"
          size="small"
          style={{ marginLeft: 10 }}
          onClick={ getDining }
        >
          getDining
        </Button>
      </div>
    </div>
  )
};

export default Home;