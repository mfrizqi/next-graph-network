const graphOptions = {
  nodes: {
    shape: "dot",
    scaling: {
      min: 1,
      max: 1
    },
    font: '12px arial white'
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