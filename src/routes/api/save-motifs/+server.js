import fs from "fs";
import path from "path";
import { json } from "@sveltejs/kit";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputPath = path.join(
	__dirname,
	"..", // api
	"..", // routes
	"..", // src
	"..", // root
	"static", // <-- static folder
	"data",
	"motifs.json"
);

export async function POST({ request }) {
	const motifs = await request.json();

	try {
		fs.writeFileSync(outputPath, JSON.stringify(motifs, null, 2));
		return json({ success: true });
	} catch (err) {
		return json({ success: false, error: err.message }, { status: 500 });
	}
}
