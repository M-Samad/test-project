import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { findOccurrences } from './utils/tracker'
// import { displayGraphWithCode, displayResults } from './utils/display'
import { Graph } from 'graphlib'
import FlowChartComponent from './FlowGraph'
// import GraphComponent from './FlowGraph'



function App() {
  const [count, setCount] = useState(0)
  const searchString = "searchString"; 
  const graph = new Graph();
  const [graphElements, setGraphElements] = useState<any[]>([]);

  const transformData = (_nodes: any, _edgeObjs: any) => {
    const elements: any[] = [];
  
    // Convert nodes
    for (const nodeId in _nodes) {
      const nodeData = _nodes[nodeId];
      if (nodeData) { // Check if nodeData is defined
        elements.push({
          id: nodeId,
          data: { label: nodeData.type },
          position: { x: Math.random() * 500, y: Math.random() * 500 } // Random position for now
        });
      }
    }
  
    // Convert edges
    for (const edgeId in _edgeObjs) {
      const edge = _edgeObjs[edgeId];
      elements.push({
        id: edgeId,
        source: edge.v,
        target: edge.w,
        animated: true
      });
    }
  
    return elements;
  };
  
  async function runAnalysis() {
    const occurrences = await findOccurrences(searchString);
    // displayResults(occurrences);
    
    for (const [key, value] of Object.entries(occurrences)) {
      graph.setNode(key, value);
    }
    for (const [key, value] of Object.entries(occurrences)) {
      for (const [key2, value2] of Object.entries(value)) {
        graph.setEdge(key, key2, value2);
      }
    }
    
    // const graphnode = await displayGraphWithCode(graph, occurrences);
    let  { _nodes, _edgeObjs } = graph;
    console.log("=================+==================",_nodes,_edgeObjs);
    const transform = transformData(_nodes, _edgeObjs);
    setGraphElements(transform);

    console.log("=================+==================",graph);
    }
  useEffect(() => {
    runAnalysis();
  }
  , [ count]);
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      <FlowChartComponent elements={graphElements} />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      {/* {console.log("graph",graph)} */}
      {/* <GraphComponent graph={graph} /> */}
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
