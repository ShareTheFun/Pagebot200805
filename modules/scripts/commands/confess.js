module.exports.config = {
  name: "confess", // Command Name (IMPORTANT)
  author: "Jmlabaco", // Your name as the author
  version: "1.0", // Increment version if you update the command
  category: "Messaging", // The category of the command
  description: "Send an anonymous message to a specific user using their UID.", // Description of the command
  adminOnly: false, // Whether only admins can use this command
  usePrefix: true, // Requires prefix to activate the command
  cooldown: 5, // Cooldown time in seconds
};

// The code scripts runs here
// event and args are the parameters you get from the command handler
module.exports.run = function ({ event, args }) {
  if (args.length < 2) {
    return api.sendMessage(
      "Usage: /confess <UID> <message>\nExample: /confess 123456 Hello!",
      event.sender.id
    );
  }

  const uid = args[0]; // The UID of the recipient
  const message = args.slice(1).join(" "); // The message to send

  // Send the message to the specified UID
  api.sendMessage(
    `You have received an anonymous confession: "${message}"`,
    uid,
    (err) => {
      if (err) {
        return api.sendMessage(
          "Failed to send your confession. Please check the UID and try again.",
          event.sender.id
        );
      }
      api.sendMessage("Your confession has been sent successfully!", event.sender.id);
    }
  );
};
    
