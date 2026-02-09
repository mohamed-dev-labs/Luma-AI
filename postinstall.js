const displayLogo = require('./logo');
const chalk = require('chalk');

console.log(chalk.green.bold('\n✅ Luma AI has been installed successfully!\n'));
displayLogo();
console.log(chalk.cyan('To get started, run: ') + chalk.bold('luma-ai --help'));
console.log(chalk.cyan('To train the model, run: ') + chalk.bold('luma-ai train\n'));
