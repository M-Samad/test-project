// FlowChartComponent.tsx
import React from 'react';
import ReactFlow from 'react-flow-renderer';

const FlowChartComponent: React.FC<{ elements: any[] }> = ({ elements }) => {
  return <ReactFlow elements={elements} style={{ width: '100%', height: '500px' }} />;
}

export default FlowChartComponent;
