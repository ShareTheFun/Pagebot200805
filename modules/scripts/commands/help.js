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
  const commandsPath = path.join(__dirname, "../commands");

  // If the user provides a command name (e.g., /help shoti)
  if (args.length > 0) {
    const commandName = args[0].toLowerCase(); // Get the command name
    try {
      const commandFile = fs
        .readdirSync(commandsPath)
        .find((file) => file.endsWith(".js") && file.startsWith(commandName));

      if (!commandFile) {
        return api.sendMessage(`❌ Command "${commandName}" not found.`, event.sender.id);
      }

      const command = require(path.join(commandsPath, commandFile));
      if (command.config) {
        let message = `🔍 Command Details:\n\n`;
        message += `🔹 Name: ${command.config.name}\n`;
        message += `📖 Description: ${command.config.description}\n`;
        message += `🛠️ Version: ${command.config.version || "N/A"}\n`;
        message += `📂 Category: ${command.config.category || "General"}\n`;
        message += `✍️ Author: ${command.config.author || "Unknown"}\n`;
        message += `⚡ Use Prefix: ${command.config.usePrefix ? "Yes" : "No"}\n`;

        return api.sendMessage(message, event.sender.id);
      }
    } catch (error) {
      return api.sendMessage(
        `❌ Error fetching details for command "${commandName}".`,
        event.sender.id
      );
    }
  }

  // If no command name is provided, show all commands and events
  let message = `✨ Welcome to the Help Menu! ✨\n\n`;
  message += `📜 Below is a list of all available commands and events:\n\n`;

  // Load and log command details
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  message += `📋 Commands:\n`;
  commandFiles.forEach((file) => {
    const command = require(path.join(commandsPath, file));
    if (command.config) {
      message += `🔹 ${command.config.usePrefix ? PREFIX : ""}${command.config.name.toUpperCase()}\n`;
      message += `   📖 ${command.config.description}\n`;
      message += `   ✍️ Author: ${command.config.author || "Unknown"}\n\n`;
    }
  });

  // Load and log event details
  const eventsPath = path.join(__dirname, "../events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));
  message += `📅 Events:\n`;
  eventFiles.forEach((file) => {
    const event = require(path.join(eventsPath, file));
    if (event.config) {
      message += `🔸 ${event.config.name.toUpperCase()}\n`;
      message += `   📖 ${event.config.description}\n`;
      message += `   ✍️ Author: ${event.config.author || "Unknown"}\n\n`;
    }
  });

  message += `💡 Tip: Use these commands and events to maximize your experience!\n`;
  message += `💬 Need more help? Contact an admin or refer to the documentation.\n`;
  message += `🎉 Enjoy using the bot! 🎉`;

  // Send the general help message
  api.sendMessage(message, event.sender.id);
};
