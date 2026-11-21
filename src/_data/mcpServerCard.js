import site from "./site.js";
import { buildMcpServerCard } from "../../mcp/metadata.mjs";

export default buildMcpServerCard(site.url);
