import React from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
import './index.less';

const Home = () => {
  function callback(key) {
    console.log(key);
  }
  return( 
    <div className="page-content">
      1111
    </div>
  )
};

export default Home;