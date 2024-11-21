"use client"
import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";

export default function Graph() {
 
  const [networkData, setNetworkData] = useState([])

  const nodes = [
    { id: 1, label: "label 1" },
    { id: 2, label: "label 2" },
    { id: 3, label: "label 3" },
    { id: 4, label: "label 4" },
    { id: 5, label: "label 5" },
  ];
  const edges = [
    { from: 1, to: 3 },
    { from: 1, to: 2 },
    { from: 2, to: 4 },
    { from: 2, to: 5 },
    { from: 3, to: 3 },
  ];

  const options = {}

  const NetworkRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    async function fetchPosts() {
      let res = await fetch('https://673e87d1a9bc276ec4b4ba76.mockapi.io/network-graph/networks')
      let data = await res.json()
      setNetworkData(data)
    }

    fetchPosts();

    const network =
      NetworkRef.current &&
      new Network(NetworkRef.current, { networkData, edges }, options || {});
      console.log(network)
  }, [NetworkRef, networkData, edges]);


  return (
    <div className="p-10">
      <h1 className="text-xl">Graphs page</h1>
      <div id="mynetwork" style={{backgroundColor:'white', height: '50vh'}} ref={NetworkRef}></div>
    </div>
  );
}