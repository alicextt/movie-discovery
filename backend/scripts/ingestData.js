import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { google } from "googleapis";
import readline from "readline";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CREDENTIALS_PATH = path.resolve(__dirname, "../credentials.json");
const TOKEN_PATH = path.resolve(__dirname, "../token.json");
const MOVIE_EXPORT_PATH = path.resolve(__dirname, "../movie.json");

/**
 *  Authenticate with Google client
 * @returns Authenticated Google client
 */
async function authenticate() {
  const content = fs.readFileSync(CREDENTIALS_PATH, "utf-8");
  const credentials = JSON.parse(content);
  const { client_secret, client_id, redirect_uris } = credentials.installed;

  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    console.log("Setting token for OAuth2 client");

    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
    oAuth2Client.setCredentials(token);
  } else {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/drive.readonly"],
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    
    // Prompt user for code
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const code = await new Promise((resolve) => {
    rl.question("Enter the code from Google: ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
   });

    // Exchange code for token
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log("Token saved to", TOKEN_PATH);
  }

  return oAuth2Client;
}

// Recursive function to fetch files
async function listFilesRecursively(drive, folderId, path = '', filesList = []) {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: "files(id, name, mimeType)",
    pageSize: 1000,
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  });

  for (const file of res.data.files) {
    if (file.mimeType === "application/vnd.google-apps.folder") {
      console.log("PATH " + path + " Found folder:", file.name);

      await listFilesRecursively(drive, file.id, path + "/" + file.name, filesList);
    } else if (file.mimeType === "application/json") {
        console.log("PATH " + path + " Found JSON file:", file.name);

        filesList.push({ id: file.id, name: file.name });
    }
  }

  return filesList;
}

async function fetchFileContents(drive, filesList){
  let promises = Array.from(filesList.values()).map(file =>
    drive.files.get({
      fileId: file.id,
      alt: "media",
    }).then(fileContent => ({
      id: file.id,
      name: file.name,
      ...fileContent.data
    }))
  );
  const result = await Promise.all(promises);
  return result;
}

async function main() {
  const auth = await authenticate();
  const drive = google.drive({ version: "v3", auth });

  const folderId = "1Z-Bqt69UgrGkwo0ArjHaNrA7uUmUm2r6";

  const allJsonFiles = await listFilesRecursively(drive, folderId);
  const allFileContents = await fetchFileContents(drive, allJsonFiles);

  fs.writeFileSync(MOVIE_EXPORT_PATH, JSON.stringify(allFileContents.sort((a, b) => a.title.localeCompare(b.title)), null, 2));
  console.log("All movie data exported to:", MOVIE_EXPORT_PATH);
}

main().catch(console.error);