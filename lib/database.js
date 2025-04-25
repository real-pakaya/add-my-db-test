const fetch = require("node-fetch");
const axios = require("axios");
const config = require("../config");

// Replace these with your GitHub credentials
const userName = `${config.GITHUB_USER_NAME}`;
const token = `ghp_${config.GITHUB_AUTH_TOKEN}`;
const repoName = "PRIME-NIYOX-DB";

// Function to fetch data from GitHub API
async function githubApiRequest(url, method = "GET", data = {}) {
  try {
    const options = {
      method,
      headers: {
        Authorization: `Basic ${Buffer.from(`${userName}:${token}`).toString(
          "base64"
        )}`,
        "Content-Type": "application/json",
      },
    };

    if (method === "GET" || method === "HEAD") {
      // Remove the body property for GET and HEAD requests
      delete options.body;
    } else {
      // For other methods (POST, PUT, DELETE, etc.), add the JSON.stringify data to the request body
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    return await response.json();
  } catch (error) {
    throw new Error(`GitHub API request failed: ${error.message}`);
  }
}

async function checkRepoAvailability() {
  try {
    const apiUrl = `https://api.github.com/repos/${userName}/${repoName}`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(apiUrl, { headers });

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return false;
    } else {
      console.error("Error:", error.message);
    }
  }
}

// 1. Function to search GitHub file
async function githubSearchFile(filePath, fileName) {
  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}?ref=main`;
  const data = await githubApiRequest(url);
  return data.find((file) => file.name === fileName);
}

// 2. Function to create a new GitHub file
async function githubCreateNewFile(filePath, fileName, content) {
  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}/${fileName}`;
  const data = {
    message: `Create new file: ${fileName}`,
    content: Buffer.from(content).toString("base64"),
  };
  return await githubApiRequest(url, "PUT", data);
}

// 3. Function to delete a GitHub file
async function githubDeleteFile(filePath, fileName) {
  const file = await githubSearchFile(filePath, fileName);
  if (!file) throw new Error("File not found on GitHub.");

  const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}/${fileName}`;
  const data = {
    message: `Delete file: ${fileName}`,
    sha: file.sha,
  };
  await githubApiRequest(url, "DELETE", data);
}

// 4. Function to get GitHub file content
async function githubGetFileContent(filePath, fileName) {
  const file = await githubSearchFile(filePath, fileName);
  if (!file) throw new Error("File not found on GitHub.");

  const url = file.download_url;
  const response = await fetch(url);
  return await response.text();
}

// 5. Function to clear GitHub file content and add new content
async function githubClearAndWriteFile(filePath, fileName, content) {
  const file = await githubSearchFile(filePath, fileName);
  if (!file) {
    await githubCreateNewFile(fileName, content);
  } else {
    const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${filePath}/${fileName}`;
    const data = {
      message: `Modify file: ${fileName}`,
      content: Buffer.from(content).toString("base64"),
      sha: file.sha,
    };
    return await githubApiRequest(url, "PUT", data);
  }
}

// 6. Function to delete an existing GitHub file and upload a new one
async function githubDeleteAndUploadFile(fileName, newContent) {
  await githubDeleteFile(fileName);
  await githubCreateNewFile(fileName, newContent);
}

//========================================
async function updateCMDStore(MsgID, CmdID) {
  try {
    let olds = JSON.parse(await githubGetFileContent("Non-Btn", "data.json"));
    olds.push({ [MsgID]: CmdID });
    var add = await githubClearAndWriteFile(
      "Non-Btn",
      "data.json",
      JSON.stringify(olds, null, 2)
    );
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function isbtnID(MsgID) {
  try {
    let olds = JSON.parse(await githubGetFileContent("Non-Btn", "data.json"));
    let foundData = null;
    for (const item of olds) {
      if (item[MsgID]) {
        foundData = item[MsgID];
        break;
      }
    }
    if (foundData) return true;
    else return false;
  } catch (e) {
    return false;
  }
}

async function getCMDStore(MsgID) {
  try {
    let olds = JSON.parse(await githubGetFileContent("Non-Btn", "data.json"));
    let foundData = null;
    for (const item of olds) {
      if (item[MsgID]) {
        foundData = item[MsgID];
        break;
      }
    }
    return foundData;
  } catch (e) {
    console.log(e);
    return false;
  }
}

function getCmdForCmdId(CMD_ID_MAP, cmdId) {
  const result = CMD_ID_MAP.find((entry) => entry.cmdId === cmdId);
  return result ? result.cmd : null;
}

const connectdb = async () => {
  let availabilityrepo = await checkRepoAvailability();
  if (!availabilityrepo) {
    const response = await axios.post(
      "https://api.github.com/user/repos",
      {
        name: repoName,
        private: true, // Set to true for a private repo
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    let get = {
      ANTI_BAD: [],
      MAX_SIZE: 150,
      ANTI_CALL: "",
      ANTI_DELETE: "",
      AUTO_READ_STATUS: "",
      AUTO_STATUS_REPLY: "",
      AUTO_STATUS_REACT: "",
      AUTO_BLOCK: "",
      WORK_TYPE: "",
      PRESENCE: "",
      READ_MESSAGE: "",
      ANTI_LINK: [],
      AUTO_BIO: "",
      MOROCCO_BLOCK: "",
      AUTO_VOICE: "",
      AI_CHAT: "",
      AUTO_REACT: "",
      ANTI_BOT: [],
      ALIVE: `set your alive msg`,
      AUTO_STATUS_MSG: `SUPER`,
      PREFIX: ".",
      LOGO: `https://i.ibb.co/6FFXvFL/NiyoX-Md.jpg`,
      OWNER: `94740460412`,
    };
    await githubCreateNewFile("settings", "settings.json", JSON.stringify(get));
    let btnget = [];
    await githubCreateNewFile("Non-Btn", "data.json", JSON.stringify(btnget));
    console.log(`Database "${repoName}" created successfully 🛢️`);
  } else console.log("Database connected 🛢️");
};
//=====================================================================
async function input(setting, data) {
  // Fetch the current settings from GitHub
  let get = JSON.parse(await githubGetFileContent("settings", "settings.json"));

  // Update the setting in both get and config objects
  const updateSettingValue = (key) => {
    get[key] = data;
    config[key] = data;
  };

  // Check and update the corresponding setting
  switch (setting) {
    case "ANTI_BAD":
      updateSettingValue("ANTI_BAD");
      break;
    case "MAX_SIZE":
      updateSettingValue("MAX_SIZE");
      break;
    case "READ_MESSAGE":
      updateSettingValue("READ_MESSAGE");
      break;
    case "PREFIX":
      updateSettingValue("PREFIX");
      break;
    case "AUTO_READ_STATUS":
      updateSettingValue("AUTO_READ_STATUS");
      break;
    case "AUTO_STATUS_REPLY":
      updateSettingValue("AUTO_STATUS_REPLY");
      break;
    case "AUTO_STATUS_REACT":
      updateSettingValue("AUTO_STATUS_REACT");
      break; 
    case "WORK_TYPE":
      updateSettingValue("WORK_TYPE");
      break;
    case "PRESENCE":
      updateSettingValue("PRESENCE");
      break;
    case "ANTI_CALL":
      updateSettingValue("ANTI_CALL");
      break;
    case "ANTI_DELETE":
      updateSettingValue("ANTI_DELETE");
      break;
    case "AUTO_BLOCK":
      updateSettingValue("AUTO_BLOCK");
      break;
    case "ANTI_LINK":
      updateSettingValue("ANTI_LINK");
      break;
    case "ANTI_BOT":
      updateSettingValue("ANTI_BOT");
      break;   
    case "MOROCCO_BLOCK":
      updateSettingValue("MOROCCO_BLOCK");
      break;    
    case "AUTO_VOICE":
      updateSettingValue("AUTO_VOICE");
      break;
    case "AI_CHAT":
      updateSettingValue("AI_CHAT");
      break;  
    case "AUTO_REACT":
      updateSettingValue("AUTO_REACT");
      break; 
    case "AUTO_BIO":
      updateSettingValue("AUTO_BIO");
      break;
    case "ALIVE":
      updateSettingValue("ALIVE");
      break;
    case "AUTO_STATUS_MSG":
      updateSettingValue("AUTO_STATUS_MSG");
      break;
    case "LOGO":
      updateSettingValue("LOGO");
      break;
    case "OWNER":
      updateSettingValue("OWNER");
      break;
    default:
      console.warn(`Setting "${setting}" is not recognized.`);
      return false; // Indicate that the setting was not found
  }

  // Write the updated settings back to GitHub
  return await githubClearAndWriteFile(
    "settings",
    "settings.json",
    JSON.stringify(get, null, 2)
  );
}

async function get(setting) {
  // Fetch the current settings from GitHub
  let get = JSON.parse(await githubGetFileContent("settings", "settings.json"));

  // Retrieve the requested setting
  switch (setting) {
    case "ANTI_BAD":
      return get.ANTI_BAD;
    case "PREFIX":
      return get.PREFIX;
    case "MAX_SIZE":
      return get.MAX_SIZE;
    case "WORK_TYPE":
      return get.WORK_TYPE;
    case "PRESENCE":
      return get.PRESENCE;
    case "READ_MESSAGE":
      return get.READ_MESSAGE;
    case "ANTI_LINK":
      return get.ANTI_LINK;
      case "ANTI_BOT":
      return get.ANTI_BOT;
    case "AUTO_VOICE":
      return get.AUTO_VOICE;
    case "AI_CHAT":
      return get.AI_CHAT;  
    case "AUTO_REACT":
      return get.AUTO_REACT; 
    case "MOROCCO_BLOCK":
      return get.MOROCCO_BLOCK;
    case "ALIVE":
      return get.ALIVE;
    case "AUTO_STATUS_MSG":
      return get.AUTO_STATUS_MSG;
    case "AUTO_READ_STATUS":
      return get.AUTO_READ_STATUS;
    case "AUTO_STATUS_REPLY":
      return get.AUTO_STATUS_REPLY;
     case "AUTO_STATUS_REACT":
      return get.AUTO_STATUS_REACT; 
    case "ANTI_CALL":
      return get.ANTI_CALL;
    case "ANTI_DELETE":
      return get.ANTI_DELETE;
    case "AUTO_BLOCK":
      return get.AUTO_BLOCK;
    case "LOGO":
      return get.LOGO;
    case "OWNER":
      return get.OWNER;
    default:
      console.warn(`Setting "${setting}" is not recognized.`);
      return null; // Return null for unrecognized settings
  }
}

async function updb() {
  // Fetch the current settings from GitHub
  let get = JSON.parse(await githubGetFileContent("settings", "settings.json"));

  // Update the config object with the fetched settings
  config.MAX_SIZE = Number(get.MAX_SIZE);
  config.ALIVE = get.ALIVE;
  config.AUTO_STATUS_MSG = get.AUTO_STATUS_MSG;
  config.LOGO = get.LOGO;
  config.OWNER = get.OWNER;
  config.PREFIX = get.PREFIX;
  config.AUTO_READ_STATUS = get.AUTO_READ_STATUS;
  config.AUTO_STATUS_REPLY = get.AUTO_STATUS_REPLY;
  config.AUTO_STATUS_REACT = get.AUTO_STATUS_REACT;
  config.ANTI_BAD = get.ANTI_BAD;
  config.ANTI_LINK = get.ANTI_LINK;
  config.ANTI_BOT = get.ANTI_BOT;
  config.AUTO_BLOCK = get.AUTO_BLOCK;
  config.AUTO_BIO = get.AUTO_BIO;
  config.MOROCCO_BLOCK = get.MOROCCO_BLOCK;
  config.AUTO_VOICE = get.AUTO_VOICE;
  config.AI_CHAT = get.AI_CHAT;
  config.AUTO_REACT = get.AUTO_REACT;
  config.WORK_TYPE = get.WORK_TYPE; // Added WORK_TYPE
  config.PRESENCE = get.WAPRESENCE; // Added WAPRESENCE
  config.READ_MESSAGE = get.READ_MESSAGE; // Added READ_MESSAGE
  config.ANTI_CALL = get.ANTI_CALL; // Added ANTI_CALL
  config.ANTI_DELETE = get.ANTI_DELETE; // Added ANTI_CALL

  console.log("Database updated ✅");
}

async function updfb() {
  // Define the default settings
  let get = {
    ANTI_BAD: [],
    MAX_SIZE: 100,
    ANTI_LINK: [],
    PREFIX: ".",
    ANTI_BOT: [],
    AUTO_BIO: "",
    MOROCCO_BLOCK: "",
    AUTO_VOICE: "",
    AI_CHAT: "",
    AUTO_REACT: "",
    ALIVE: "set your alive msg",
    AUTO_STATUS_MSG: "SUPER",
    AUTO_READ_STATUS: "",
    AUTO_STATUS_REPLY: "",
    AUTO_STATUS_REACT: "",
    LOGO: "https://i.ibb.co/6FFXvFL/NiyoX-Md.jpg",
    OWNER: "94740460412",
    WORK_TYPE: "default", // Added WORK_TYPE
    PRESENCE: "", // Added WAPRESENCE
    READ_MESSAGE: "", // Added READ_MESSAGE
    ANTI_CALL: "", // Added ANTI_CALL
    ANTI_DELETE: "", // Added ANTI_DELETE
    AUTO_BLOCK: "", // Added AUTO_BLOCK
  };

  // Write the default settings to GitHub
  await githubClearAndWriteFile(
    "settings",
    "settings.json",
    JSON.stringify(get, null, 2)
  );

  config.MAX_SIZE = 175
  config.ALIVE = "set your alive msg";
  config.AUTO_STATUS_MSG = "SUPER";
  config.LOGO = "https://i.ibb.co/6FFXvFL/NiyoX-Md.jpg";
  config.OWNER = "94740460412";
  config.ANTI_BAD = [];
  config.ANTI_LINK = [];
  config.PREFIX = "."
  config.ANTI_BOT = []
  config.AUTO_READ_STATUS = ""
  config.AUTO_STATUS_REPLY = ""
  config.AUTO_STATUS_REACT = ""
  config.WORK_TYPE = ""
  config.PRESENCE = ""
  config.READ_MESSAGE = ""
  config.ANTI_CALL = ""
  config.ANTI_DELETE = ""
  config.AUTO_BLOCK = ""
  config.AUTO_BIO = ""
  config.MOROCCO_BLOCK = ""
  config.AUTO_VOICE = ""
  config.AI_CHAT = ""
  config.AUTO_REACT = ""

  console.log("Database updated ✅");
}

async function upresbtn() {
  let btnget = [];
  await githubClearAndWriteFile("Non-Btn", "data.json", JSON.stringify(btnget));
}
module.exports = {
  updateCMDStore,
  isbtnID,
  getCMDStore,
  getCmdForCmdId,
  connectdb,
  input,
  get,
  updb,
  updfb,
  upresbtn,
};
