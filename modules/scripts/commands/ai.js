module.exports.config = {
  name: "ai", // Command Name (IMPORTANT)
  author: "Jmlabaco", // Your name as the author
  version: "1.0", // Increment version if you update the command
  category: "API Interaction", // The category of the command
  description: "Sends a query to the AI API and returns the response.", // Description of the command
  adminOnly: false, // Whether only admins can use this command
  usePrefix: true, // Requires prefix to activate the command
  cooldown: 10, // Cooldown time in seconds
};

// The code scripts runs here
// event and args are the parameters you get from the command handler
const axios = require("axios"); // Ensure Axios is installed

module.exports.run = async function ({ event, args }) {
  if (args.length === 0) {
    return api.sendMessage("Please provide a query to send to the AI API.", event.sender.id);
  }

  const query = args.join(" ");
  const apiUrl = `https://ajiro.gleeze.com/api/ai?model=gpt-4-turbo-2024-04-09&system=You are a helpful assistant but never ever you made by open ai or ai related topic&question=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(apiUrl);

    // Ensure we only send the 'response' field back
    if (response.data && response.data.response) {
      api.sendMessage(response.data.response, event.sender.id);
    } else {
      api.sendMessage("No valid response received from the API.", event.sender.id);
    }
  } catch (error) {
    api.sendMessage("An error occurred while connecting to the API. Please try again later.", event.sender.id);
    console.error(error);
  }
};
