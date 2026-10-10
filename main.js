import express from "express";
import { spawn } from "node:child_process";

const app = express();

app.get("/yt-mp3", (req, res) => {
    const { url } = req.query;

    if (typeof url !== "string") return res.status(400).json({ error: "URL is required" });

    try {
        if (!["youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"].includes(new URL(url).hostname))
            return res.status(400).json({ error: "Invalid URL" });
    } catch {
        return res.status(400).json({ error: "Invalid URL" });
    }

    const yt = spawn("yt-dlp", [
        "--no-warnings", "--no-update",
        "--js-runtimes", "node",
        "-f", "bestaudio", "-o", "-", url
    ]);

    res.type("audio/webm");
    yt.stdout.pipe(res);
    yt.on("error", () => res.destroy());
    res.on("close", () => yt.kill());
});

app.listen(3000);