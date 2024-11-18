module.exports.config = {
  name: "confess", // Command Name (IMPORTANT)
  author: "Jmlabaco", // Your name as the author
  version: "1.0.1", // Increment version for updates
  category: "Messaging", // The category of the command
  description: "Confess to someone anonymously using their Facebook link.", // Description of the command
  adminOnly: false, // Whether only admins can use this command
  usePrefix: true, // Requires prefix to activate the command
  cooldown: 5, // Cooldown time in seconds
};

// The code script runs here
module.exports.run = async function ({ api, event, args }) {
  // Helper function to send replies
  function reply(message) {
    api.sendMessage(message, event.threadID, event.messageID);
  }

  // Parse input
  const content = args.join(" ").split("|").map((item) => item.trim());
  const messageText = content[0];
  const facebookLink = content[1];

  // Validate input
  if (!args[0] || !messageText || !facebookLink) {
    return reply(
      `Wrong format.\nUsage: /${this.config.name} <your message> | <facebook link>\nExample: /${this.config.name} I like you! | https://facebook.com/profile`
    );
  }

  try {
    // Get UID from the Facebook link
    const recipientUID = await api.getUID(facebookLink);

    // Send the confession to the recipient
    api.sendMessage(
      `Someone anonymously confessed to you:\n\nMessage: "${messageText}"`,
      recipientUID,
      () => reply("Confession has been sent successfully!")
    );
  } catch (err) {
    console.error(err);
    reply(
      "Failed to send your confession. It might be an invalid Facebook link, or the user could not be found."
    );
  }
};
