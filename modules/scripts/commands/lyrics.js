const axios = require("axios");

module.exports.config = {
  name: "lyrics",
  author: "Jmlabaco",
  version: "1.0",
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

    // Send title and artist first
    const infoMessage = `🎵 Lyrics Found! 🎵\n\n🎶 Title: ${title || "Unknown"}\n🎤 Artist: ${artist || "Unknown"}`;
    api.sendMessage(infoMessage, event.sender.id, () => {
      // Send the full lyrics without truncation
      api.sendMessage(`📜 Lyrics:\n\n${lyrics}`, event.sender.id, () => {
        // Optional: Send a GIF attachment after lyrics
        api.sendAttachment("https://i.gifer.com/KNiu.gif", event.sender.id);
      });
    });
  } catch (error) {
    console.error(error);
    api.sendMessage(
      `❌ An error occurred while fetching lyrics. Please try again later.`,
      event.sender.id
    );
  }
};
