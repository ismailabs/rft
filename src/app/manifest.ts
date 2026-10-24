import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ringgit Finance Tracker",
    short_name: "RFT",
    description: "Manual MYR personal finance records",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    background_color: "#F7F7F4",
    theme_color: "#17665E",
    lang: "en",
    icons: [
      {
        src: "/icons/rft-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/rft-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/rft-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
