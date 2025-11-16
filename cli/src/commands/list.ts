import chalk from "chalk";
import { scanIcons } from "../utils/fileScanner";

export default async function list() {
  const icons = await scanIcons();

  const categories = [...new Set(icons.map(icon => icon.category))];

  console.log(chalk.cyan("Categorias disponíveis:\n"));

  for (const category of categories) {
    const count = icons.filter(i => i.category === category).length;
    console.log(`${chalk.green("•")} ${chalk.white(category)} (${count})`);
  }
}

