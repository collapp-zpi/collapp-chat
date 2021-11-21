const chalk = require("chalk");
const u = require("util");
const ncp = require("ncp");
const Listr = require("listr");
const fs = require("fs-extra");
const path = require("path");
const archive = require("zip-a-folder");
const { hashElement } = require("folder-hash");
const copy = u.promisify(ncp);

let hashedData;

const options = {
  folders: { exclude: ["node_modules"] },
  encoding: "hex",
};

async function copyFiles() {
  const res = copy(
    path.resolve(__dirname, "../plugin"),
    path.resolve(__dirname, "../../", "temp"),
    {
      clobber: false,
    }
  );
  return res;
}

async function copyPackage() {
  await fs.copy(
    path.resolve(__dirname, "../../package.json"),
    path.resolve(__dirname, "../../", "temp", "package.json")
  );
  return await fs.copy(
    path.resolve(__dirname, "../../tailwind.config.js"),
    path.resolve(__dirname, "../../", "temp", "tailwind.config.js")
  );
}

async function createTempFolder() {
  const folderPath = path.resolve(__dirname, "../../", "temp");
  return await fs.ensureDir(folderPath);
}

async function cleanTempFolder() {
  const folderPath = path.resolve(__dirname, "../../", "temp");
  fs.removeSync(folderPath, { recursive: true });
  return true;
}

async function cleanPlugin() {
  const folderPath = path.resolve(__dirname, "../../out");
  fs.removeSync(folderPath, { recursive: true });
  return true;
}

async function zip() {
  await fs.ensureDir(path.resolve(__dirname, "../../", "out"));
  return await archive.zip(
    path.resolve(__dirname, "../../", "temp"),
    path.resolve(__dirname, "../../", "out", `${hashedData.hash}.zip`)
  );
}

async function validateConfigFile() {
  const file = fs.readFileSync(
    path.resolve(__dirname, "../plugin", "collapp-config.json")
  );
  const parsed = JSON.parse(file);
  if (parsed["app_name"] && parsed["app_name"] != "") return true;
  else
    throw new Error(
      "It seems that you have missed a app_name property in your config file"
    );
}

async function validate() {
  if (
    !(await fs.pathExists(path.resolve(__dirname, "../plugin", "components")))
  )
    throw new Error(
      `In your plugin folder there should be a ${chalk.cyan(
        "components"
      )} folder`
    );

  if (!(await fs.pathExists(path.resolve(__dirname, "../plugin", "logic"))))
    throw new Error(
      `In your plugin folder there should be a ${chalk.cyan("logic")} folder`
    );

  if (!(await fs.pathExists(path.resolve(__dirname, "../plugin", "styles"))))
    throw new Error(
      `In your plugin folder there should be a ${chalk.cyan("styles")} folder`
    );

  if (
    !(await fs.pathExists(
      path.resolve(__dirname, "../plugin", "collapp-config.json")
    ))
  )
    throw new Error(
      `In your plugin folder there should be a ${chalk.cyan(
        "collapp-config.json"
      )} file with a configuration`
    );

  if (
    !(await fs.pathExists(
      path.resolve(__dirname, "../plugin", "components", "client.jsx")
    ))
  )
    throw new Error(
      `In your plugin/component folder there should be a ${chalk.cyan(
        "client.jsx"
      )} file, exporting main component`
    );

  if (
    !(await fs.pathExists(
      path.resolve(__dirname, "../plugin", "logic", "server.js")
    ))
  )
    throw new Error(
      `In your plugin/logic folder there should be a ${chalk.cyan(
        "server.js"
      )} file, exporting main logic`
    );
}

async function createHash() {
  const hash = await hashElement(
    path.resolve(__dirname, "../../", "temp"),
    options
  );
  hashedData = hash;
  fs.writeFile(
    path.resolve(__dirname, "../../", "temp", "hash.json"),
    JSON.stringify(hash),
    { flag: "wx" },
    function (err) {
      if (err) throw err;
      console.log("It's saved!");
    }
  );
}

async function zipPlugin() {
  console.log(chalk.cyan.bold("Preparing ZIP to send for a verification\n"));

  const tasks = new Listr([
    {
      title: "Prepare enviroment",
      task: async () => {
        const r1 = await cleanTempFolder();
        const r2 = await cleanPlugin();
        return r1 & r2;
      },
    },
    {
      title: "Validate project structure",
      task: () => validate(),
    },
    {
      title: "Validate config file",
      task: () => validateConfigFile(),
    },
    {
      title: "Create temp folder",
      task: () => createTempFolder(),
    },
    {
      title: `Copy all files from a ${chalk.cyan("plugin")} folder`,
      task: () => copyFiles(),
    },
    {
      title: `Copy ${chalk.green.italic("package.json")} to a ${chalk.cyan(
        "plugin"
      )} folder`,
      task: () => copyPackage(),
    },
    {
      title: `Calculate ${chalk.cyan("Hash")} code of your plugin`,
      task: () => createHash(),
    },
    {
      title: `Creating a ${chalk.cyan("ZIP")} archive for your plugin`,
      task: () => zip(),
    },
    {
      title: "Clean up temp files",
      task: () => cleanTempFolder(),
    },
  ]);
  await tasks.run();

  console.log(chalk.cyan.bold("\nYour plugin seems to be ready ✅"));
  console.log(
    "Your files have been packed into a %s file:\n%s",
    chalk.cyan.bold("ZIP"),
    chalk.gray.italic(
      path.resolve(__dirname, "../../", "out", `${hashedData.hash}.zip`)
    )
  );
  console.log(
    `\nIt's time to create an intent to upload a plugin on your ${chalk.cyan(
      "developer account."
    )}`
  );
  console.log(
    `Our ${chalk.cyan(
      "Admin"
    )} will verify the quality and security of your code!`
  );
  console.log(
    `If all happens to be ${chalk.cyan(
      "up to our standards"
    )}, in a matter of days you can expect your plugin to be accessible for all to ✨cherish✨\n`
  );
  console.log(
    `Please do ${chalk.red.bold(
      "NOT"
    )} rename your ZIP file, it will certainly be ${chalk.red.bold(
      "rejected"
    )} \n\n\n`
  );
}

module.exports = { zipPlugin };
