import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const audioDir = path.join(__dirname, "..", "static", "assets", "audio");
const outputFile = path.join(__dirname, "..", "src", "data", "tracks.json");

fs.readdir(audioDir, (err, files) => {
	if (err) {
		console.error("Error reading audio directory:", err);
		return;
	}

	const audioFiles = files.filter((file) => file.endsWith(".mp3"));
	const tracks = audioFiles.map((file) => ({
		name: path.basename(file, ".mp3"),
		file: `/assets/audio/${file}`
	}));

	console.log(tracks);
	fs.writeFileSync(outputFile, JSON.stringify(tracks, null, 2));
	console.log(`✅ Track names written to ${outputFile}`);
});
