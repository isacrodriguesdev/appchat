// configurações de inicialização

const hosts = {
  Home: "192.168.0.102",
  NA: "192.168.50.168",
  Production: "162.216.243.210"
}

export let config = {
  hostAddr: hosts.Production,
  hostPort: 3759,
  hostSecure: true
}

// config = {
//   hostAddr: hosts.NA,
//   hostPort: 3759,
//   hostSecure: false
// }

export function getHost() {
  return `${config.hostSecure ? "https" : "http"}://${config.hostAddr}:${config.hostPort}`
}