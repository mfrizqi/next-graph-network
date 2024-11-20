"use client"
import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";

export default function graph() {

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

  const networkRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const network =
      networkRef.current &&
      new Network(networkRef.current, { nodes, edges }, options || {});

      // network && network.setSize(`${800}px`, `${1200}px`);

    // Use `network` here to configure events, etc
  }, [networkRef, nodes, edges]);


  return (
    <div className="p-10">
      <h1 className="text-xl">Graphs page</h1>
      <div id="mynetwork" style={{backgroundColor:'white', height: '50vh'}} ref={networkRef}></div>
    </div>
  );
}