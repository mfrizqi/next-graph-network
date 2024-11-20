"use client"
import { useEffect, useRef } from "react";
import { Network } from "vis-network";

export default function Graph() {

  const nodes = [
    { id: 1, label: "Node 1" },
    { id: 2, label: "Node 2" },
    { id: 3, label: "Node 3" },
    { id: 4, label: "Node 4" },
    { id: 5, label: "Node 5" },
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
    const network =
      NetworkRef.current &&
      new Network(NetworkRef.current, { nodes, edges }, options || {});
      console.log(network)
  }, [NetworkRef, nodes, edges]);


  return (
    <div className="p-10">
      <h1 className="text-xl">Graphs page</h1>
      <div id="mynetwork" style={{backgroundColor:'white', height: '50vh'}} ref={NetworkRef}></div>
    </div>
  );
}