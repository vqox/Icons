import chalk from "chalk";

export default function helpCommand() {
    console.log(chalk.cyan("\nCLI Icons Tool - Comandos disponíveis\n"));

    console.log(chalk.green("icons search <query>"));
    console.log("  Buscar ícones por nome.\n");

    console.log(chalk.green("icons list"));
    console.log("  Listar categorias disponíveis.\n");

    console.log(chalk.green("icons help"));
    console.log("  Mostrar ajuda.\n");
}
