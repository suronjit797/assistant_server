import colors from "colors/safe";
import app from "./app";
import config from "./config/index";
import os from "os";
import redisConnection from "./config/redis";

export function getNetworkIPs() {
  const interfaces = os.networkInterfaces();
  const ips = [];

  for (const name of Object.keys(interfaces)) {
    const ifaceList = interfaces[name];
    if (!ifaceList) continue;
    for (const iface of ifaceList) {
      if (iface.family === "IPv4" && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }

  return ips;
}

const PORT = config.PORT || 5000;
const HOST = config.NODE_ENV === "development" ? "0.0.0.0" : "localhost";

const startTime = Date.now();

export const serverLogger = async () =>
  app.listen(PORT, HOST, async () => {
    const bootTime = Date.now() - startTime;
    const localURL = `http://localhost:${PORT}`;
    const networkIPs = getNetworkIPs();

    console.log(colors.green(colors.bold(`\n🚀 Server ready in ${bootTime} ms\n`)));
    console.log(colors.blue(`  ➜ Local:   ${colors.underline(localURL)}`));
    await redisConnection.flushall();

    networkIPs.forEach((ip: string) => {
      console.log(colors.blue(`  ➜ Network: ${colors.underline(`http://${ip}:${PORT}`)}`));
    });
  });
