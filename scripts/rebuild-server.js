import http from "http";
import { exec } from "child_process";

const PORT = 3333;

http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/rebuild") {
    console.log("🔁 Rebuild SEO demandé");

    exec("node scripts/generate-professionals.js", (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        res.writeHead(500);
        res.end("Erreur rebuild");
        return;
      }

      console.log(stdout);
      res.writeHead(200);
      res.end("Rebuild OK");
    });
    return;
  }

  res.writeHead(404);
  res.end("Not found");
}).listen(PORT, () => {
  console.log(`🚀 Rebuild server listening on port ${PORT}`);
});