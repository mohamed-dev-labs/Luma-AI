const chalk = require('chalk');
const tinygradient = require('tinygradient');

const displayLogo = () => {
    const gradient = tinygradient([
        {color: '#FF0080', pos: 0}, // Magenta/Pink
        {color: '#7928CA', pos: 0.5}, // Purple
        {color: '#0070F3', pos: 1}  // Blue
    ]);

    const logoText = `
    ██╗     ██╗   ██╗███╗   ███╗ █████╗      █████╗ ██╗
    ██║     ██║   ██║████╗ ████║██╔══██╗    ██╔══██╗██║
    ██║     ██║   ██║██╔████╔██║███████║    ███████║██║
    ██║     ██║   ██║██║╚██╔╝██║██╔══██║    ██╔══██║██║
    ███████╗╚██████╔╝██║ ╚═╝ ██║██║  ██║    ██║  ██║██║
    ╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═╝
    `;

    const lines = logoText.split('\n');
    lines.forEach((line, i) => {
        const color = gradient.rgbAt(i / lines.length).toHex();
        console.log(chalk.hex(color)(line));
    });

    console.log(chalk.bold.hex('#7928CA')('\n          ✨ Luma AI: The Future of Mathematical Image Generation ✨\n'));
};

module.exports = displayLogo;
