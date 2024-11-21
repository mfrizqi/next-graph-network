"use client"
import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";

export default function Graph() {

  const db = {
    baseUrl: 'https://ffkvumomrhabgwbrvblq.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZma3Z1bW9tcmhhYmd3YnJ2YmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyMTY1NjQsImV4cCI6MjA0Nzc5MjU2NH0.G5Y-c7j8TCHCPd25Cat_YquvD9RU_JaJPgMKHhmThJA'
  }

  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const options = {
    nodes: {
      shape: "dot",
      scaling:{
        min: 1,
        max: 1
      },
    }
  }

  const NetworkRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (nodes.length === 0) {
      fetch(db.baseUrl + '/rest/v1/networks', {
        method: 'GET',
        headers: {
          "Apikey": db.anonKey,
          "Authorization": "Bearer " + db.anonKey
        }
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          setNodes(data)
          setIsLoading(false)
        })

      fetch(db.baseUrl + '/rest/v1/edges', {
        method: 'GET',
        headers: {
          "Apikey": db.anonKey,
          "Authorization": "Bearer " + db.anonKey
        }
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          setEdges(data)
          setIsLoading(false)
        })
    }

    const network =
      NetworkRef.current &&
      new Network(NetworkRef.current, { nodes, edges }, options || {});
    console.log(network)

    console.log(nodes)
    console.log(edges)

  }, [NetworkRef, nodes, edges]);

  return (

    <div className="p-10">
      <h1 className="text-xl">Graphs page</h1>
      {isLoading ? (
        <div className="border-2 border-zinc-600 bg-zinc-600 rounded-md text-gray-500 flex justify-center items-center" style={{ height: '80vh' }}>Loading Nodes...</div>
      ) : (
        <div id="mynetwork" className="border-2 border-zinc-600 rounded-md" style={{ backgroundColor: 'white', height: '80vh' }} ref={NetworkRef}></div>
      )}
    </div>
  );
}