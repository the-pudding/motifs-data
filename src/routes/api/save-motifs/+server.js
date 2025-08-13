import fs from "fs";
import path from "path";
import { json } from "@sveltejs/kit";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// static/data directory
const dataDir = path.join(
	__dirname,
	"..",
	"..",
	"..",
	"..", // up to project root
	"static",
	"data"
);

function sanitizeId(id) {
	return String(id)
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9_-]/g, "");
}

export async function POST({ request }) {
	const { musicalId, motifs } = await request.json();
	const safeId = sanitizeId(musicalId);

	if (!safeId)
		return json(
			{ success: false, error: "musicalId required" },
			{ status: 400 }
		);
	if (typeof motifs === "undefined")
		return json({ success: false, error: "motifs required" }, { status: 400 });

	try {
		fs.mkdirSync(dataDir, { recursive: true });
		const outputPath = path.join(dataDir, `${safeId}-motifs.json`);
		fs.writeFileSync(outputPath, JSON.stringify(motifs, null, 2), "utf8");
		return json({ success: true, path: `/data/${safeId}-motifs.json` });
	} catch (err) {
		return json({ success: false, error: err.message }, { status: 500 });
	}
}
