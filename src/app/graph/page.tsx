"use client"
import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";

import graphOptions from "./graphOption";

export default function Graph() {

  const db = {
    baseUrl: 'https://ffkvumomrhabgwbrvblq.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZma3Z1bW9tcmhhYmd3YnJ2YmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyMTY1NjQsImV4cCI6MjA0Nzc5MjU2NH0.G5Y-c7j8TCHCPd25Cat_YquvD9RU_JaJPgMKHhmThJA'
  }

  const [nodes, setNodes] = useState<any[]>([])
  const [edges, setEdges] = useState([])
  const [selectedNode, setSelectedNode] = useState<any>({})

  // const [modal, setModal] = useState({
  //   type: 'add',
  //   button: 'Submit'
  // })

  const [isLoading, setIsLoading] = useState(true)
  const [notification, setNotification] = useState<any>({
    message: 'Message',
    status: 'alert-info',
    show: false
  })

  let clusterIndex: number = 0;
  let clusters: any = [];
  let lastClusterZoomLevel: number = 0;
  const clusterFactor: number = 0.9;

  const options = graphOptions;

  const NetworkRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (nodes.length === 0) {
      // Fetch init data Nodes & Edges
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
          adjustTitleData(data)
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
          setEdges(data)
          setIsLoading(false)
        })
    }

    const network =
      NetworkRef.current &&
      new Network(NetworkRef.current, { nodes, edges }, options || {});

    network?.once("initRedraw", function () {
      if (lastClusterZoomLevel === 0) {
        lastClusterZoomLevel = network?.getScale();
      }
    });

    network?.on("click", function (params) {
      console.log(params)
      
      // params.event = "[original event]";
      console.log(network.getNodeAt(params.pointer.DOM))
      // consolFe.log(network.getEdgeAt(params.pointer.DOM))
      if (params?.nodes?.length > 0) {
        const node = params.nodes[0]
        if (typeof node === 'number') {
          const selected = getNode(node);
          console.log(selected)
          setSelectedNode(selected);
          (document.getElementById('modal_box') as any)?.showModal()
        }
      }
    });

    // network?.on("hoverNode", function (params) {
    //   // console.log("hoverNode Event:", params);
    // });

    network?.on("zoom", function (params) {
      console.log('zoomin in/out')
      if (params.direction == "-") {
        if (params.scale < lastClusterZoomLevel * clusterFactor) {
          makeClusters(params.scale);
          lastClusterZoomLevel = params.scale;
        }
      } else {
        openClusters(params.scale);
      }
    });

    function makeClusters(scale: any) {
      const clusterOptionsByData = {
        processProperties: function (clusterOptions: any, childNodes: any) {
          clusterIndex = clusterIndex + 1;
          let childrenCount = 0;
          for (let i = 0; i < childNodes.length; i++) {
            childrenCount += childNodes[i].childrenCount || 1;
          }
          clusterOptions.childrenCount = childrenCount;
          clusterOptions.label = "# " + childrenCount + "";
          clusterOptions.font = { size: childrenCount * 5 + 30 };
          clusterOptions.id = "cluster:" + clusterIndex;
          clusters.push({ id: "cluster:" + clusterIndex, scale: scale });
          return clusterOptions;
        },
        clusterNodeProperties: {
          borderWidth: 3,
          shape: "database",
          font: { size: 30 },
        },
      };
      network?.clusterOutliers(clusterOptionsByData);
      network?.stabilize();
    }

    function openClusters(scale: any) {
      const newClusters = [];
      for (let i = 0; i < clusters.length; i++) {
        if (clusters[i].scale < scale) {
          network?.openCluster(clusters[i].id);
          lastClusterZoomLevel = scale;
        } else {
          newClusters.push(clusters[i]);
        }
      }
      clusters = newClusters;
      network?.setOptions({ physics: { stabilization: { fit: false } } });
      network?.stabilize();
    }

    function getNode(nodeId: number) {
      // Accessing deep into network body to get node
      let nodeObj = (network as any)?.body.nodes[nodeId]
      return nodeObj; //nodeObj.label to get label 
    }

  }, [NetworkRef, nodes, edges]);

  function adjustTitleData(data: any) {
    let newNodes = data.map((node: any) => {
      let titlePopup = document.createElement("div");
      let titleLabel = document.createElement("div");
      let titleValue = document.createElement("div");
      titleLabel.innerHTML = node?.title;
      titleValue.innerHTML = 'IPv4: ' + node?.IPv4;

      titlePopup.appendChild(titleLabel)
      titlePopup.appendChild(titleValue)

      return {
        ...node,
        title: titlePopup
      }
    })
    setNodes(newNodes);
    setNotification({})
  }

  return (
    <>
      <div className="p-10">
        <h1 className="text-xl">Graphs page</h1>
        {/* Toast Component */}
        {notification.show ? (
          <div className="toast toast-top toast-end z-10">
            <div className={`alert ${notification.status}`}>
              <span>{notification.message}</span>
            </div>
          </div>) :
          (<></>)
        }

        {isLoading ? (
          <div className="border-2 border-zinc-600 bg-zinc-600 rounded-md text-gray-500 flex justify-center items-center" style={{ height: '80vh' }}>Loading Nodes...</div>
        ) : (
          <div className="relative">
            <div id="mynetwork" className="border-2 border-zinc-600 rounded-md bg-zinc-900" style={{ backgroundColor: '', height: '80vh' }} ref={NetworkRef}>
            </div>
            {/* <div className="absolute left-2 top-3">Plus Minus</div> */}
          </div>
        )}
        {/* <button className="btn mt-4" onClick={addNode}>Add Node</button> */}
      </div>
      {/* Modal Component */}
      <dialog id="modal_box" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello! {selectedNode?.options?.label}</h3>
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕</button>
          </form>
          <p className="py-4">Press ESC key or click the button below to close</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </>

  );
}