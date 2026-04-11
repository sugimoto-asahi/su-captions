import { storage } from "uxp";
import type { premierepro } from "@localTypes/premierepro";

export const ppro = require("premierepro") as premierepro;
export const ufs = storage.localFileSystem;
