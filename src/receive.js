const FTP = require("ftp");
const fs = require("fs");
const path = require("path");

const { logger } = require("./utils");

module.exports = (ipsender, destDownload) => {
    destDownload = path.resolve(process.cwd(), destDownload);

    const client = new FTP();

    client.on("ready", () => {
        logger.log("Conected to sender...");

        logger.log(`Downloading file to "${destDownload}"`);

        client.get("piringFile", (err, stream) => {
            if (err) throw err;

            stream.once("close", client.end);

            stream.pipe(fs.createWriteStream(destDownload));

            client.end();
        });
    });

    client.connect({
        host: ipsender,
        port: 2121,
        user: "piring",
        password: "veryHardPassword"
    });
};
