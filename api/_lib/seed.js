/* Default course used before the database has any content (first run),
   or as a safe fallback. Once you save anything in the admin panel,
   the saved content replaces this. */
module.exports = {
  name: "Digital Business Bootcamp",
  tagline: "A guided, video-first path to launching and growing a modern digital business — one lesson at a time.",
  videos: [
    {
      id: "lesson-idea",
      title: "Finding Your Digital Business Idea",
      description:
        "Every digital business starts with a clear, validated idea. In this opening lesson you'll learn how to spot real problems people pay to solve, size up a niche, and pressure-test your concept before you build anything.\n\nBy the end you'll have a one-line business idea and a short list of your first potential customers.",
      video: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
      thumbnail: "",
      resources: [
        { label: "Idea Validation Prompt", url: "https://example.com/idea-prompt", type: "prompt" },
        { label: "Niche Research Worksheet", url: "https://example.com/niche-worksheet", type: "document" },
        { label: "Market Sizing Guide", url: "https://example.com/market-sizing", type: "reference" }
      ]
    },
    {
      id: "lesson-presence",
      title: "Building Your Online Presence",
      description:
        "Now that you have an idea, it's time to show up online. This lesson covers your brand basics, a simple high-converting landing page, and the handful of tools you actually need to start.\n\nYou'll set up the foundation customers will discover and trust.",
      video: "https://vimeo.com/76979871",
      thumbnail: "",
      resources: [
        { label: "Landing Page Copy Prompt", url: "https://example.com/landing-prompt", type: "prompt" },
        { label: "Brand Starter Kit", url: "https://example.com/brand-kit", type: "document" }
      ]
    },
    {
      id: "lesson-marketing",
      title: "Marketing & Customer Acquisition",
      description:
        "A great offer is invisible without traffic. Here you'll learn how to get your first customers through organic content, simple paid ads, and a repeatable outreach routine.\n\nYou'll leave with a 7-day content and outreach plan you can run immediately.",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      thumbnail: "",
      resources: [
        { label: "Content Calendar Prompt", url: "https://example.com/content-prompt", type: "prompt" },
        { label: "Cold Outreach Templates", url: "https://example.com/outreach-templates", type: "document" }
      ]
    },
    {
      id: "lesson-scale",
      title: "Scaling & Automating Your Business",
      description:
        "With customers coming in, the final lesson is about working less while growing more. You'll map your repeatable processes, automate the busywork, and plan your next 90 days.\n\nFinish this and you'll have a lean, scalable system for your digital business.",
      video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      thumbnail: "",
      resources: [
        { label: "Automation Blueprint Prompt", url: "https://example.com/automation-prompt", type: "prompt" },
        { label: "90-Day Growth Plan", url: "https://example.com/growth-plan", type: "document" }
      ]
    }
  ]
};
