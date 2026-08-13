import { instance } from "./api";
import type { Wine } from "@/types";

export async function getWines(): Promise<Wine[]> {
  const { data } = await instance.get("/wines");
  return data;
}