const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "help",
  author: "Yan Maglinte",
  version: "1.0",
  category: "Utility",
  description: "Sends a back greeting message and lists all commands and events.",
  adminOnly: false,
  usePrefix: true,
  cooldown: 5, // Cooldown time in seconds
};

module.exports.run = function ({ event, args }) {
  if (event.type === "message" || event.postback.payload === "HELP_PAYLOAD") {
    const commandsPath = path.join(__dirname, "../commands");
    const eventsPath = path.join(__dirname, "../events");

    let message = `✨ *Welcome to the Help Menu!* ✨\n\n`;
    message += `📜 Below is a list of all available commands and events:\n\n`;

    // Load and log command details
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith(".js"));
    message += `📋 *Commands:*\n`;
    commandFiles.forEach((file) => {
      const command = require(path.join(commandsPath, file));
      if (command.config) {
        message += `🔹 *${command.config.usePrefix ? PREFIX : ""}${command.config.name.toUpperCase()}*\n`;
        message += `   📖 ${command.config.description}\n\n`;
      }
    });

    // Load and log event details
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".js"));
    message += `✨ *Events:*\n`;
    eventFiles.forEach((file) => {
      const event = require(path.join(eventsPath, file));
      if (event.config) {
        message += `🔸 *${event.config.name.toUpperCase()}*\n`;
        message += `   📖 ${event.config.description}\n\n`;
      }
    });

    message += `💡 *Tip: Use these commands and events to maximize your experience!*\n`;
    message += `💬 *Need more help? Contact an admin or refer to the documentation.*\n`;
    message += `🎉 *Enjoy using the bot!* 🎉`;

    // Send the message to the user
    api.sendMessage(message, event.sender.id);
  }
};
    
