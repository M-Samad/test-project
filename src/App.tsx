import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { findOccurrences } from './utils/tracker'
// import { displayGraphWithCode, displayResults } from './utils/display'
import { Graph } from 'graphlib'
import FlowChartComponent from './FlowGraph'
// import GraphComponent from './FlowGraph'
import Button from '@mui/material/Button';
import { TextField } from '@mui/material'
import { updateBaseURL } from './utils/variables/General'




function App() {
  const [count, setCount] = useState(0)
  const [fileLink, setFileLink] = useState("")
  const [searchText, setSearchText] = useState("")
  const [graphValue, setGraphValue] = useState({});
  const searchString = "searchString";
  const graph = new Graph();
  const [graphElements, setGraphElements] = useState<any[]>([]);

  useEffect(() => {
    function extractPathFromGitHubURL(url) {
      const githubUrlPrefix = "https://github.com/";

      // Check if the URL starts with the GitHub prefix
      if (url.startsWith(githubUrlPrefix)) {
        // Extract the path by removing the prefix
        const path = url.slice(githubUrlPrefix.length);
        return path;
      } else {
        // If the URL doesn't start with the prefix, return an error or handle it as needed
        return "";
      }
    }

    // Example usage:
    const path = extractPathFromGitHubURL(fileLink);
    console.log(path);

    updateBaseURL(path);
  }, [fileLink]);

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

  async function runAnalysis(text) {
    console.log(text, fileLink);

    const occurrences = await findOccurrences(text);
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
    let { _nodes, _edgeObjs } = graph;
    console.log("=================+==================", _nodes, _edgeObjs);
    const transform = transformData(_nodes, _edgeObjs);
    setGraphElements(transform);
    setGraphValue(graph);
    console.log("=================+==================", graph);
  }
  useEffect(() => {
    runAnalysis();
  }
    , [count]);
  return (
    <>
      <TextField id="outlined-basic" label="Github Link" variant="outlined" value={fileLink} onChange={(e) => {
        setFileLink(e.target.value);
      }} />
      <TextField id="outlined-basic" label="Text" variant="outlined" value={searchText} onChange={(e) => {
        setSearchText(e.target.value);
      }} />
      <Button variant="contained" onClick={() => runAnalysis(searchText)}>Hello world</Button>

      {graphValue?._nodes && Object.keys(graphValue?._nodes)?.map(val => {
        return (
          <div style={{color: "#000",}}>
            <p>Code Block</p>
            <text>{graphValue?._nodes[val]?.codeBlock}</text>
            <p>Declaration</p>
            <text>{graphValue?._nodes[val]?.declaration}</text>
            <p>File</p>
            <text>{graphValue?._nodes[val]?.file}</text>
            <p>Function</p>
            <text>{graphValue?._nodes[val]?.function}</text>
            <p>Location</p>
            <text>{JSON.stringify(graphValue?._nodes[val]?.location)}</text>
            <p>Type</p>
            <text>{graphValue?._nodes[val]?.type}</text>
            <hr />
          </div>
        )
      })}
    </>
  )
}

export default App
