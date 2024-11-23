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
    return api.graph({
      recipient: { id: event.sender.id },
      message: {
        text: `❌ Please provide a search term to fetch an image from Pinterest. Example: /pinterest sunset`,
      },
    });
  }

  const query = args.join(" "); // Combine arguments to form the search query
  const apiUrl = `https://ajiro.gleeze.com/api/pinterest?text=${encodeURIComponent(query)}`;

  try {
    // Fetch image links from the API
    const response = await axios.get(apiUrl);
    const { result } = response.data;

    if (!result || result.length === 0) {
      return api.graph({
        recipient: { id: event.sender.id },
        message: {
          text: `❌ Could not find any images for "${query}". Please try a different search.`,
        },
      });
    }

    // Select the first image from the results
    const imageUrl = result[0];

    // Send the image using api.graph
    api.graph({
      recipient: {
        id: event.sender.id,
      },
      message: {
        attachment: {
          type: "image",
          payload: {
            url: imageUrl,
            is_reusable: true,
          },
        },
      },
    }).then(() => {
      console.log("Image sent successfully!");
    }).catch((err) => {
      console.error("Error sending image:", err);
      api.graph({
        recipient: { id: event.sender.id },
        message: {
          text: `❌ Error sending the image: ${err.message}`,
        },
      });
    });
  } catch (error) {
    console.error("Error:", error);
    api.graph({
      recipient: { id: event.sender.id },
      message: {
        text: `❌ An error occurred: ${error.message}`,
      },
    });
  }
};
