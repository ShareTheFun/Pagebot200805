const axios = require("axios");

module.exports.config = {
  name: "lyrics",
  author: "Jmlabaco",
  version: "1.0.5",
  category: "Utility",
  description: "Fetch song lyrics by searching for the song title or artist.",
  adminOnly: false,
  usePrefix: true,
  cooldown: 5, // Cooldown time in seconds
};

module.exports.run = async function ({ event, args }) {
  if (args.length === 0) {
    return api.sendMessage(
      `❌ Please provide a song title or artist to search for lyrics. Example: /lyrics Imagine`,
      event.sender.id
    );
  }

  const query = args.join(" "); // Combine arguments to form the search query
  const apiUrl = `https://joshweb.click/search/lyrics?q=${encodeURIComponent(query)}`;

  try {
    // Fetch lyrics from the API
    const response = await axios.get(apiUrl);
    const { result } = response.data;

    if (!result || !result.lyrics) {
      return api.sendMessage(
        `❌ Could not find lyrics for "${query}". Please try a different search.`,
        event.sender.id
      );
    }

    const { title, artist, lyrics } = result;

    // Format the intro message
    let introMessage = `🎵 Lyrics Found! 🎵\n\n`;
    introMessage += `🎶 Title: ${title || "Unknown"}\n`;
    introMessage += `🎤 Artist: ${artist || "Unknown"}\n\n`;
    api.sendMessage(introMessage, event.sender.id);

    // Break lyrics into chunks of 5000 characters
    const maxChunkSize = 5000;
    const chunks = lyrics.match(new RegExp(`.{1,${maxChunkSize}}`, "g"));

    // Send each chunk sequentially
    for (const chunk of chunks) {
      await new Promise((resolve) =>
        api.sendMessage(chunk, event.sender.id, resolve)
      );
    }

    // Optional: Send a GIF attachment
    api.sendAttachment("https://i.gifer.com/KNiu.gif", event.sender.id);
  } catch (error) {
    console.error(error);
    api.sendMessage(
      `❌ An error occurred while fetching lyrics. Please try again later.`,
      event.sender.id
    );
  }
};
