const ftpd = require("ftpd");
const path = require("path");
const fs = require("fs");
const ip = require("ip");

const { logger } = require("./utils");

module.exports = filepath => {
    const fullPath = path.resolve(process.cwd(), filepath);

    if (!fs.existsSync(fullPath)) {
        logger.log(`File "${filepath}" not found!`);
        process.exit(1);
    }

    if (fs.statSync(fullPath).isDirectory()) {
        logger.log(`"${filepath}" is directory!`);
        process.exit(1);
    }

    fs.copyFileSync(
        fullPath,
        path.resolve(__dirname, "../files", "piringFile")
    );

    const server = new ftpd.FtpServer("127.0.0.1", {
        getInitialCwd: function() {
            return "../files";
        },
        getRoot: function() {
            return path.resolve(__dirname, "../");
        },
        pasvPortRangeStart: 1025,
        pasvPortRangeEnd: 1050,
        tlsOptions: null,
        allowUnauthorizedTls: true,
        useWriteFile: false,
        useReadFile: true
    });

    logger.log("Waiting for receiver..., Ctrl-C to stop");
    logger.log(
        `Type "piring receive ${ip.address()} ./${path.basename(
            filepath
        )}" for receiver...`
    );

    let username = null;

    server.on("client:connected", socket => {
        logger.log("Receiver found!");

        socket.on("command:user", function(user, success, failure) {
            if (user == "piring") {
                username = user;
                success();
            } else failure();
        });

        socket.on("command:pass", function(pass, success, failure) {
            if (pass === "veryHardPassword") success(username);
            else failure();
        });
    });

    server.listen(2121);
};
