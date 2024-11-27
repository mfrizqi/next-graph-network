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
      color: { background: "red", border: "white" },
      shape: "diamond",
    },
    vpn: {
      shape: "dot",
      color: "cyan",
    },
  },
  manipulation: {
    enabled: true,
  },
}

export default graphOptions;