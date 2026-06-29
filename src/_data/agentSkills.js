import { createHash } from "crypto";
import { readFileSync } from "fs";

const skillPath = new URL("../../agent-skills/xule-research-navigation/SKILL.md", import.meta.url);
const skillBytes = readFileSync(skillPath);
const digest = createHash("sha256").update(skillBytes).digest("hex");

export default {
    schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [
        {
            name: "xule-research-navigation",
            type: "skill-md",
            description: "Navigate Xule Lin's public research site, machine-readable indexes, markdown pages, and attribution boundaries.",
            url: "/.well-known/agent-skills/xule-research-navigation/SKILL.md",
            digest: `sha256:${digest}`
        }
    ]
};
