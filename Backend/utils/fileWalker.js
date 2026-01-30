import fs from "fs";
import path from "path";

const IGNORE_DIRS = ["node_modules", ".git","README.md"];

export function walkFiles(dirPath) {
  let results = [];

  const items = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);

    if (item.isDirectory()) {
      if (!IGNORE_DIRS.includes(item.name)) {
        results = results.concat(walkFiles(fullPath));
      }
    } else {
      results.push(fullPath);
    }
  }

  return results;
}
