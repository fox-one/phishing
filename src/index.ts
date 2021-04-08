import type { Hosts } from "./types";

import axios from "axios";

const HOSTS_JSON = "";
const CACHE_TIMEOUT = 45 * 60 * 1000;

let cacheEnd = 0;
let cacheHostList: Hosts | null = null;

function extracHost(path: string): string {
  return path
    .replace(/https:\/\/|http:\/\/|wss:\/\/|ws:\/\//, "")
    .split("/")[0];
}

export async function retrieveHostList(allowCached = true): Promise<Hosts> {
  const now = Date.now();

  if (allowCached && cacheHostList && now < cacheEnd) {
    return cacheHostList;
  }

  const response = await axios.get(HOSTS_JSON, { timeout: 10000 });
  const list = response.data as Hosts;

  cacheEnd = now + CACHE_TIMEOUT;
  cacheHostList = list;

  return list;
}

export function checkHost(items: string[], path: string): boolean {
  const hostParts = extracHost(path).split(".").reverse();

  return items.some((item): boolean => {
    const checkParts = item.split(".").reverse();

    if (checkHost.length > hostParts.length) {
      return false;
    }

    return checkParts.every((part, index) => hostParts[index] === part);
  });
}

export async function checkIfDenied(path: string, allowCached = true) {
  try {
    const { deny } = await retrieveHostList();
    return checkHost(deny, path);
  } catch (error) {
    console.error(error);

    return false;
  }
}
