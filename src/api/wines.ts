import { instance } from "./api";
import type { Wine } from "@/types";
import { mockWines } from "@/mocks/wines";

const USE_MOCK = true;

export async function getWines(): Promise<Wine[]> {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockWines), 500);
    });
  }

  const { data } = await instance.get("/wines");
  return data;
}