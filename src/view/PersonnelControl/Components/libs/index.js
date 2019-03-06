import React from 'react'
import TabRoute from 'src/components/TabRoute';
import './index.scss';

export default ({libType, defaultModule}) => (
  <TabRoute libType={libType} moduleLevel={4} defaultModule={defaultModule} />
)
