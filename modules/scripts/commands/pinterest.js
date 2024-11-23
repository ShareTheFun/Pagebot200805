const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "pinterest",
  author: "Jmlabaco",
  version: "1.0",
  category: "Utility",
  description: "Fetch an image from Pinterest based on a search query.",
  adminOnly: false,
  usePrefix: true,
  cooldown: 5, // Cooldown time in seconds
};

module.exports.run = async function ({ event, args, api }) {
  if (args.length === 0) {
    return api.sendMessage(
      `❌ Please provide a search term to fetch an image from Pinterest. Example: /pinterest sunset`,
      event.sender.id
    );
  }

  const query = args.join(" "); // Combine arguments to form the search query
  const apiUrl = `https://ajiro.gleeze.com/api/pinterest?text=${encodeURIComponent(query)}`;

  try {
    // Fetch image links from the API
    const response = await axios.get(apiUrl);
    const { result } = response.data;

    if (!result || result.length === 0) {
      return api.sendMessage(
        `❌ Could not find any images for "${query}". Please try a different search.`,
        event.sender.id
      );
    }

    // Select the first image from the results
    const imageUrl = result[0];
    const imageResponse = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream",
    });

    // Define the file path to save the image
    const cacheDir = path.resolve(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }
    const filePath = path.resolve(cacheDir, `pinterest_${Date.now()}.jpg`);

    // Save the image to the file system
    const writer = fs.createWriteStream(filePath);
    imageResponse.data.pipe(writer);

    writer.on("finish", () => {
      // Send the image
      api.sendAttachment(filePath, event.sender.id, () => {
        // Optionally delete the file after sending
        fs.unlinkSync(filePath);
      });
    });

    writer.on("error", (err) => {
      const errorMessage = `❌ Error while saving the image: ${err.message}`;
      console.error(errorMessage);
      api.sendMessage(errorMessage, event.sender.id);
    });
  } catch (error) {
    const errorMessage = `❌ An error occurred: ${error.message}\nDetails: ${error.stack}`;
    console.error(errorMessage);
    api.sendMessage(errorMessage, event.sender.id);
  }
};