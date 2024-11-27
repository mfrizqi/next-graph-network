"use client"
import { useEffect, useRef, useState } from "react";
import { Network } from "vis-network";

import graphOptions from "./graphOption";
import useDebounce from './useDebounce';
import Image from "next/image";

export default function Graph() {

  const db = {
    baseUrl: 'https://ffkvumomrhabgwbrvblq.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZma3Z1bW9tcmhhYmd3YnJ2YmxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyMTY1NjQsImV4cCI6MjA0Nzc5MjU2NH0.G5Y-c7j8TCHCPd25Cat_YquvD9RU_JaJPgMKHhmThJA'
  }

  const [networks, setNetworks] = useState<any>({})
  const [originNodes, setOriginNodes] = useState<any[]>([])
  const [nodes, setNodes] = useState<any[]>([])
  const [edges, setEdges] = useState([])
  const [filterCheck, setFilterCheck] = useState<any>({
    gateway: false,
    vpn: false
  });
  // const [selectedNode, setSelectedNode] = useState<any>({})
  const [nodeData, setNodeData] = useState<any>({})

  const [search, setSearch] = useState('');

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

          setTimeout(() => {
            adjustTitleData(data)
            setIsLoading(false)
          }, 1500);
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
          setTimeout(() => {
            setEdges(data)
            setIsLoading(false)
          }, 1500);
        })
    }

    const network =
      NetworkRef.current &&
      new Network(NetworkRef.current, { nodes, edges }, options || {});

    setNetworks(network)

    network?.once("initRedraw", function () {
      if (lastClusterZoomLevel === 0) {
        lastClusterZoomLevel = network?.getScale();
      }
    });

    network?.on("click", function (params: any) {
      console.log(params)
      if (params?.nodes?.length > 0) {
        const node = params.nodes[0]
        if (typeof node === 'number') {
          const selected = getNode(node);
          console.log(selected)
          // setSelectedNode(selected);
          setNodeData(selected);
          (document.getElementById('modal_box') as any)?.showModal()
        }
      }
    });

    network?.on("zoom", function (params: any) {
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
      const nodeObj = (network as any)?.body.nodes[nodeId]
      return nodeObj; //nodeObj.label to get label 
    }


  }, [NetworkRef, nodes, edges]);

  useDebounce(() => {
    if (nodes.length > 0) {
      const findNode = nodes.filter((node: any) => node.label.toLowerCase().includes(search.toLowerCase()))
      const node = getNode(findNode[0]?.id)
      const moveOption = {
        position: { x: node?.x, y: node?.y },
        scale: 1.5,
        animation: {
          duration: 500,
          easingFunction: 'easeInOutQuad'
        }
      }
      console.log(node)
      if (node && search) {
        networks?.moveTo(moveOption)
      } else if (!search) {
        moveOption.position.x = 0
        moveOption.position.x = 0
        moveOption.scale = 1
        networks?.moveTo(moveOption)
      } else {
        setNotification({
          message: 'Node ' + search + ' is not found',
          status: 'alert-warning',
          show: true
        })

        setTimeout(() => {
          setNotification({
            message: '',
            status: 'alert-error',
            show: false
          })
        }, 3000);
      }
    }
  }, [nodes, search], 800
  );

  function getNode(nodeId: number) {
    // Accessing deep into network body to get node
    const nodeObj = (networks as any)?.body.nodes[nodeId]
    return nodeObj; //nodeObj.label to get label 
  }

  function handleSearch(e: any) { setSearch(e.target.value) };

  function adjustTitleData(data: any) {
    const newNodes = data.map((node: any) => {
      const titlePopup = document.createElement("div");
      const titleLabel = document.createElement("div");
      const titleValue = document.createElement("div");
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
    setOriginNodes(newNodes);
    setNotification({})
  }

  function handleChange(event: any) {
    const options = nodeData.options
    const { name, value } = event.target;
    if (name === 'label')
      options.label = value
    else {
      options.IPv4 = value
    }

    setNodeData({ ...nodeData, options })

    networks.body.emitter.emit('_dataChanged')
    networks?.redraw()
  }

  // function handleSubmit() {
  //   setSelectedNode(nodeData)
  //   setNodeData({})
  // }

  function openFullscreen() {
    const elem = document.documentElement as HTMLElement & {
      mozRequestFullScreen(): Promise<void>;
      webkitRequestFullscreen(): Promise<void>;
      msRequestFullscreen(): Promise<void>;
    };
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem?.webkitRequestFullscreen) { /* Safari */
      elem?.webkitRequestFullscreen();
    } else if (elem?.msRequestFullscreen) { /* IE11 */
      elem?.msRequestFullscreen();
    }
  }

  function deleteSearch() {
    setSearch('')
  }

  function handleChangeFilter(event: any) {
    console.log(event.target.name, event.target.checked)
    const name = event.target.name;
    setFilterCheck((filterCheck: any) => ({
      ...filterCheck,
      [name]: event.target.checked
    }))
    filterCheck[name] = event.target.checked

    console.log(filterCheck)

    const filterValue: any = []
    const filtered: any = []

    for (const key in filterCheck) {
      console.log(`${key}: ${filterCheck[key]}`)
      if (filterCheck[key]) {
        filterValue.push(key)
      }
    }
    console.log(filterValue)

    if (filterValue.length > 0) {
      filterValue.forEach((key: string) => {
        console.log(`key: ${key}`)
        filtered.push.apply(filtered, originNodes.filter((node: any) => {
          return node.group === key
        }))
      });

      console.log('filtered:', filtered)
      setNodes(filtered)
    } else {
      setNodes(originNodes)
    }
  }

  const countFilter: any = () => {
    const count = Object.values(filterCheck).reduce((a: any, item: any) => a + (item === true ? 1 : 0), 0)
    return count;
  }

  return (
    <>
      <div className="p-6 md:p-10">
        <div className="p-4 mb-4 bg-gray-200 w-full md:w-1/2 rounded-lg">
          <h1 className="text-xl font-semibold" style={{color: '#6a39df'}}>Network Graph</h1>
          <p className="text-slate-600">An overview network graph gateway & VPN</p>
        </div>
        {/* Toast Component */}
        {notification.show ? (
          <div className="toast toast-top toast-end z-10">
            <div className={`alert ${notification.status}`}>
              <span className={`${notification.status === 'alert-error' ? 'text-white' : 'text-black'}`}>{notification.message}</span>
            </div>
          </div>) :
          (<></>)
        }

        {isLoading ? (
          <section className="border-2 border-slate-500 bg-zinc-600 rounded-md text-gray-500 flex justify-center items-center bg-zinc-900" style={{ height: '80vh' }}>
            <div className="text-center">
              <span className="loading loading-spinner loading-lg text-primary mx-auto"></span>
              <div className="text-center">Loading Network Graph</div>
            </div>
          </section>
        ) : (
          <div className="relative mb-4">
            {/* Search & Filter  */}
            <section className="flex items-top">
              <label className="input flex items-center gap-2 w-full md:w-4/12 lg:w-1/4 mb-4 border border-slate-500">
                <Image src="/img/search.svg" width={20} height={20} className="cursor-pointer opacity-75" alt="Search Icon" />
                <input type="text" className="grow" placeholder="Search label..." value={search || ''}
                  onChange={handleSearch} />
                {search !== '' ? (
                  <Image src="/img/x.svg" width={28} height={28} className="cursor-pointer opacity-75" onClick={deleteSearch} alt="Delete Search" />
                ) : (<></>)}
              </label>

              {/* Filter Dropdown */}
              <div className="indicator">
                <span className={`indicator-item badge badge-secondary ${countFilter() > 0 ? 'opacity-100' : 'opacity-0'}`}>{countFilter()}</span>
                <div className="dropdown dropdown-bottom dropdown-end">
                  <div tabIndex={0} role="button" className="btn ms-4">
                    <span className="font-medium md:block hidden">Filter</span>
                    <img src="/img/filter.svg" className="opacity-60 w-8 md:w-5" alt="Filter Search" /> </div>
                  <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow border border-slate-300">
                    <div className="p-2 font-semibold">Group By: </div>
                    <li>
                      <div>
                        <label className="label cursor-pointer">
                          <input type="checkbox" className="checkbox me-4" name="gateway" onChange={handleChangeFilter} value={filterCheck.gateway} checked={filterCheck.gateway} />
                          <span className="label-text">Gateway</span>
                        </label>
                      </div>
                      <div>
                        <label className="label cursor-pointer">
                          <input type="checkbox" className="checkbox me-4" name="vpn" onChange={handleChangeFilter} value={filterCheck.vpn} checked={filterCheck.vpn} />
                          <span className="label-text">VPN</span>
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

            </section>

            <div id="mynetwork" className="border-2 border-slate-400 rounded-md" style={{ backgroundColor: '#1a1a1a', height: '80vh' }} ref={NetworkRef}>
            </div>
            <div className="absolute font-bold hover:cursor-pointer opacity-75 hover:opacity-100 lg:block hidden" style={{ bottom: '12px', right: '134px', fontSize: "18px" }} onClick={openFullscreen}>
              &#x26F6;
            </div>
          </div>
        )}
        {/* <button className="btn mt-4" onClick={addNode}>Add Node</button> */}
      </div>
      {/* Modal Component */}
      <dialog id="modal_box" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Detail Node</h3>
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3">✕</button>
          </form>
          <section className="mt-4 mb-8">
            <label className="form-control w-full max-w-xs mb-3">
              <div className="label">
                <span className="label-text">Node Label</span>
              </div>
              <input type="text" placeholder="Type here" name="label" className="input input-bordered w-full max-w-xs" onChange={handleChange} value={nodeData?.options?.label || ''} readOnly />
            </label>
            <label className="form-control w-full max-w-xs mb-3">
              <div className="label">
                <span className="label-text">IPv4</span>
              </div>
              <input type="text" placeholder="Type here" name="IPv4" className="input input-bordered w-full max-w-xs" onChange={handleChange} value={nodeData?.options?.IPv4 || ''} readOnly />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Group</span>
              </div>
              <input type="text" placeholder="Type here" name="IPv4" className="input input-bordered w-full max-w-xs" onChange={handleChange} value={nodeData?.options?.group || ''} readOnly />
            </label>
          </section>
          {/* <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost me-2" name="cancelBtn" onClick={handleSubmit}>Cancel</button>
              <button className="btn" name="submitBtn" onClick={handleSubmit}>Save Changes</button>
            </form>
          </div> */}
        </div>
      </dialog>
    </>
  );
}