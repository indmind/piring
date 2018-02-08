const program = require("commander");

const { version, description } = require("../package.json");

program.version(version).description(description);

program.option("-v, --version", "Show version", version);

program
    .command("help")
    .alias("h")
    .description("Show this help message")
    .action(() => program.help());

program
    .command("send <filepath>")
    .alias("s")
    .description("send file")
    .action(require("./send"));

program
    .command("receive <ipsender> <destinationDownload>")
    .alias("r")
    .description("receive file")
    .action(require("./receive"));

program.parse(process.argv);

if (program.args.length < 1) {
    console.log(`piring version: ${program.version()}, 'piring -h' for help`);
}
