module.exports.config = {
  name: "confess", // Command Name (IMPORTANT)
  author: "Jmlabaco", // Your name as the author
  version: "1.2", // Increment version for updates
  category: "Messaging", // The category of the command
  description: "Send an anonymous message to a specific user using their UID.", // Description of the command
  adminOnly: false, // Whether only admins can use this command
  usePrefix: true, // Requires prefix to activate the command
  cooldown: 5, // Cooldown time in seconds
};

// The code script runs here
// event, args, and api are parameters provided by the command handler
module.exports.run = function ({ event, args, api }) {
  // Check if arguments are valid
  if (args.length < 2) {
    return api.sendMessage(
      "Usage: /confess <UID> <message>\nExample: /confess 61550941044179 Hello!",
      event.senderID
    );
  }

  const uid = args[0]; // Extract the UID of the recipient
  const message = args.slice(1).join(" "); // Combine the remaining arguments into the message

  // Attempt to send the confession
  api.sendMessage(
    `You have received an anonymous confession: "${message}"`,
    uid,
    (err) => {
      if (err) {
        console.error("Error sending message:", err); // Log the error for debugging
        return api.sendMessage(
          "Failed to send your confession. Please ensure the UID is valid and try again.",
          event.senderID
        );
      }
      api.sendMessage("Your confession has been sent successfully!", event.senderID);
    }
  );
};
