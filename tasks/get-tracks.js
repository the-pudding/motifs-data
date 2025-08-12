import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import getMP3Duration from "get-mp3-duration";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const audioDir = path.join(
	__dirname,
	"..",
	"static",
	"assets",
	"audio",
	"full"
);
const outputFile = path.join(__dirname, "..", "src", "data", "tracks.json");

async function main() {
	try {
		const files = await fs.readdir(audioDir);
		const audioFiles = files.filter((f) => f.toLowerCase().endsWith(".mp3"));

		const tracks = await Promise.all(
			audioFiles.map(async (file) => {
				const fullPath = path.join(audioDir, file);

				let duration = 0;
				try {
					const buffer = await fs.readFile(fullPath);
					const ms = getMP3Duration(buffer); // milliseconds
					duration = Number((ms / 1000).toFixed(3)); // seconds
				} catch (err) {
					console.warn(`⚠️ Could not read duration for ${file}:`, err.message);
				}

				return {
					name: path.basename(file, ".mp3"),
					file: `/assets/audio/full/${file}`,
					duration
				};
			})
		);

		await fs.writeFile(outputFile, JSON.stringify(tracks, null, 2));
		console.log(`✅ Wrote ${tracks.length} tracks to ${outputFile}`);
	} catch (err) {
		console.error("Error building tracks.json:", err);
		process.exit(1);
	}
}

main();
