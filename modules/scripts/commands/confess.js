module.exports.config = {
  name: "confess", // Command Name (IMPORTANT)
  author: "Jmlabaco", // Your name as the author
  version: "1.1", // Increment version for updates
  category: "Messaging", // The category of the command
  description: "Send an anonymous message to a specific user using their UID.", // Description of the command
  adminOnly: false, // Whether only admins can use this command
  usePrefix: true, // Requires prefix to activate the command
  cooldown: 5, // Cooldown time in seconds
};

// The code scripts runs here
// event and args are the parameters you get from the command handler
module.exports.run = function ({ event, args, api }) {
  // Validate input
  if (args.length < 2) {
    return api.sendMessage(
      "Usage: /confess <UID> <message>\nExample: /confess 61550941044179 Hello!",
      event.senderID
    );
  }

  const uid = args[0]; // The UID of the recipient
  const message = args.slice(1).join(" "); // Combine the rest of the arguments into the message

  // Send the message to the recipient UID
  api.sendMessage(
    `You have received an anonymous confession: "${message}"`,
    uid,
    (err) => {
      if (err) {
        console.error(err); // Log the error for debugging
        return api.sendMessage(
          "Failed to send your confession. Please check the UID and try again.",
          event.senderID
        );
      }
      api.sendMessage("Your confession has been sent successfully!", event.senderID);
    }
  );
};
