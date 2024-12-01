const graphOptions = {
  nodes: {
    shape: "dot",
    scaling: {
      min: 1,
      max: 1
    },
    font: {
      size: 12,
      color: "white",
      face: "arial",
      strokeWidth: 3,
      strokeColor: "#000000",
    },
  },
  physics: {
    stabilization: { fit: false },
    adaptiveTimestep: false
  },
  interaction: {
    navigationButtons: true,
    keyboard: true,
    hover: true
  },
  layout: { randomSeed: 20 },
  groups: {
    gateway: {
      color: { background: "#30d99b", border: "white" },
      shape: "diamond",
      size: 35
    },
    vpn: {
      shape: "dot",
      color: "#FF9B71",
      size: 20
    },
  },
  manipulation: {
    enabled: true,
  },
  edges:{
    width: 2
  }
}

export default graphOptions;