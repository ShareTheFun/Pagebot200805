const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "mlhero",
  author: "Jmlabaco",
  version: "1.0",
  category: "Utility",
  description: "Fetch details about a Mobile Legends hero.",
  adminOnly: false,
  usePrefix: true,
  cooldown: 5, // Cooldown time in seconds
};

module.exports.run = async function ({ event, args }) {
  if (args.length === 0) {
    return api.sendMessage(
      `❌ Please provide a hero name to search for. Example: /mlhero Layla`,
      event.sender.id
    );
  }

  const query = args.join(" "); // Combine arguments into the query
  const apiUrl = `https://joshweb.click/api/mlhero?q=${encodeURIComponent(query)}`;

  try {
    // Fetch hero data from the API
    const response = await axios.get(apiUrl);
    const { result } = response.data;

    if (!result || !result.hero_img) {
      return api.sendMessage(
        `❌ Could not find information for hero "${query}". Please try a different name.`,
        event.sender.id
      );
    }

    const {
      hero_img,
      description,
      release_date,
      role,
      specialty,
      lane,
      price,
      gameplay_info,
      story_info_list,
    } = result;

    // Construct the main hero information message
    let message = `🎮 **Mobile Legends Hero Information** 🎮\n\n`;
    message += `🦸 Name: ${query}\n`;
    message += `📖 Description: ${description.trim() || "N/A"}\n`;
    message += `📅 Release Date: ${release_date || "Unknown"}\n`;
    message += `🎭 Role: ${role || "Unknown"}\n`;
    message += `⭐ Specialty: ${specialty || "Unknown"}\n`;
    message += `🛡️ Lane: ${lane || "Unknown"}\n`;
    message += `💰 Price: ${price || "Unknown"}\n\n`;

    message += `📊 **Gameplay Info**:\n`;
    for (const [key, value] of Object.entries(gameplay_info || {})) {
      message += `- ${key}: ${value || "Unknown"}\n`;
    }

    message += `\n📜 **Story Info**:\n`;
    for (const [key, value] of Object.entries(story_info_list || {})) {
      message += `- ${key}: ${value || "Unknown"}\n`;
    }

    // Save the hero image locally
    const cacheDir = path.join(__dirname, "cache");
    const imagePath = path.join(cacheDir, "mlbb.png");

    // Ensure cache directory exists
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    // Download and save the hero image
    const imageResponse = await axios.get(hero_img, { responseType: "arraybuffer" });
    fs.writeFileSync(imagePath, imageResponse.data);

    // Send the hero information
    api.sendMessage(message, event.sender.id, () => {
      // Send the saved image as an attachment
      api
        .graph({
          recipient: {
            id: event.sender.id,
          },
          message: {
            attachment: {
              type: "image",
              payload: {
                url: `file://${imagePath}`,
                is_reusable: true,
              },
            },
          },
        })
        .then((res) => {
          console.log("Image sent successfully.");
        })
        .catch((err) => {
          console.error("Error sending image:", err);
        });
    });
  } catch (error) {
    console.error(error);
    api.sendMessage(
      `❌ An error occurred while fetching hero information. Please try again later.`,
      event.sender.id
    );
  }
};
