import ServerAxios from "./serverAxios.js";

export const patchSniffer = async ({ url, name, port }) => {
  return ServerAxios.patch(`/sniffers`, {
    downstreamUrl: url,
    name,
    port,
  });
};

export const getSniffers = async () => {
  return ServerAxios.get("/sniffers").then((res) => res.data.sniffers);
};

export const getSniffersByPorts = async (ports) => {
  return ServerAxios.get("/sniffers", {
    params: {
      port: ports
    }
  }).then((res) => {
    return res.data.sniffers
  });
};
