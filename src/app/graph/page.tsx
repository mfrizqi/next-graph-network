"use client"
import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";

export default function Graph() {

  const db = {
    baseUrl: 'https://ffkvumomrhabgwbrvblq.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZma3Z1bW9tcmhhYmd3YnJ2YmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyMTY1NjQsImV4cCI6MjA0Nzc5MjU2NH0.G5Y-c7j8TCHCPd25Cat_YquvD9RU_JaJPgMKHhmThJA'
  }

  // const [networks, SetNetworks] = useState<any>({})
  const [nodes, setNodes] = useState<any[]>([])
  const [edges, setEdges] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  let clusterIndex: number = 0;
  let clusters: any = [];
  let lastClusterZoomLevel: number = 0;
  const clusterFactor: number = 0.9;

  const options = {
    nodes: {
      shape: "dot",
      scaling: {
        min: 1,
        max: 1
      },
      font: '12px arial white'
    },
    physics: { stabilization: { fit: false } }
    // manipulation: {
    //   addNode: function (data: any, callback: any) {
    //     // filling in the popup DOM elements
    //     document.getElementById("node-operation").innerText = "Add Node";
    //     editNode(data, clearNodePopUp, callback);
    //   },
    //   editNode: function (data: any, callback: any) {
    //     // filling in the popup DOM elements
    //     document.getElementById("node-operation").innerText = "Edit Node";
    //     editNode(data, cancelNodeEdit, callback);
    //   },
    //   addEdge: function (data: any, callback: any) {
    //     if (data.from == data.to) {
    //       var r = confirm("Do you want to connect the node to itself?");
    //       if (r != true) {
    //         callback(null);
    //         return;
    //       }
    //     }
    //     document.getElementById("edge-operation").innerText = "Add Edge";
    //     editEdgeWithoutDrag(data, callback);
    //   },
    //   editEdge: {
    //     editWithoutDrag: function (data: any, callback: any) {
    //       document.getElementById("edge-operation").innerText = "Edit Edge";
    //       editEdgeWithoutDrag(data, callback);
    //     },
    //   },
    // },
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
          setEdges(data)
          setIsLoading(false)
        })
    }

    const network =
      NetworkRef.current &&
      new Network(NetworkRef.current, { nodes, edges }, options || {});

    // SetNetworks(network)`

    network?.once("initRedraw", function () {
      if (lastClusterZoomLevel === 0) {
        lastClusterZoomLevel = network?.getScale();
      }
    });

    network?.on("click", function (params) {
      // console.log(params)
      params.event = "[original event]";
      console.log(
        "click event, getNodeAt returns: "
      );
      // console.log(network.getNodeAt(params.pointer.DOM))
      (document.getElementById('modal_box') as any)?.showModal()

    });


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

    // // if we click on a node, we want to open it up!
    // network?.on("selectNode", function (params) {
    //   if (params.nodes.length == 1) {
    //     if (network.isCluster(params.nodes[0]) == true) {
    //       network.openCluster(params.nodes[0]);
    //     }
    //   }
    // });

    // network?.enableEditMode()
    // network?.addNodeMode()

    // console.log('=== Check id ===')
    // console.log(nodes.find((el:any)=>{return el.id === 99}))

    // if (!nodes.find((el: any) => { return el.id === 99 })) {
    //   setNodes([ // with a new array
    //     ...nodes, // that contains all the old items
    //     { id: 99, label: 'NewNode' } // and one new item at the end
    //   ])
    // }

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

  }, [NetworkRef, nodes, edges]);

  function addNode() {

  }



  return (
    <>
      <div className="p-10">
        <h1 className="text-xl">Graphs page</h1>
        {/* Toast Component */}
        <div className="toast toast-top toast-end">
          <div className="alert alert-info">
            <span>New message arrived.</span>
          </div>
        </div>
        {isLoading ? (
          <div className="border-2 border-zinc-600 bg-zinc-600 rounded-md text-gray-500 flex justify-center items-center" style={{ height: '80vh' }}>Loading Nodes...</div>
        ) : (
          <div className="relative">
            <div id="mynetwork" className="border-2 border-zinc-600 rounded-md" style={{ backgroundColor: '', height: '80vh' }} ref={NetworkRef}>
            </div>
            <div className="absolute left-2 top-3">Plus Minus</div>
          </div>
        )}
        <button className="btn mt-4" onClick={addNode}>Add Node</button>
      </div>
      {/* Modal Component */}
      <dialog id="modal_box" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Hello!</h3>
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