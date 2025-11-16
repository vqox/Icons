import fs from "fs";
import path from "path";
import { resolveIconsRoot } from "./paths";

export interface IconData {
  name: string;
  category: string;
  path: string;
}

export async function scanIcons(): Promise<IconData[]> {
  const root = resolveIconsRoot();

  const staticDir = path.join(root, "static");
  const animatedDir = path.join(root, "animated");

  const results: IconData[] = [];


  const staticCategories = fs.readdirSync(staticDir);

  for (const category of staticCategories) {
    const categoryPath = path.join(staticDir, category);

    if (!fs.lstatSync(categoryPath).isDirectory()) continue;

    const files = fs.readdirSync(categoryPath);

    for (const file of files) {
      if (!file.endsWith(".png")) continue;

      results.push({
        name: file.replace(".png", ""),
        category,
        path: path.join("static", category, file)
      });
    }
  }


  const animatedFiles = fs.readdirSync(animatedDir);

  for (const file of animatedFiles) {
    if (!file.endsWith(".gif")) continue;

    results.push({
      name: file.replace(".gif", ""),
      category: "animated",
      path: path.join("animated", file)
    });
  }

  return results;
}
