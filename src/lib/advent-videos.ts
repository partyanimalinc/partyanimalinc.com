// Bijan Robinson "Life with a Mini-Me" advent series, hosted on Cloudflare Stream.
// Order: the two hero social cuts first, then the six mini-me "incidents".
// UIDs + customer code come from the Stream upload (scripts/_upload-stream.mjs).
export const CF_CUSTOMER_CODE = "customer-t663x3xn0d5w1cjh";

export type AdventVideo = { key: string; title: string; uid: string };

export const ADVENT_VIDEOS: AdventVideo[] = [
  { key: "teenymates", title: "TeenyMates Advent Calendar", uid: "e9117f20b65890c892cceb2ed6b23b6b" },
  { key: "squeezymates", title: "SqueezyMates Helmets", uid: "6d3798aa22cc9e03b92f17872a5a199a" },
  { key: "cookie", title: "The Cookie Incident", uid: "c885188db2c799fd2f20fc57711c02f8" },
  { key: "google", title: "The Super Bowl Search", uid: "0ddb83051b7ec5cd594db509c0fb62a7" },
  { key: "toothpaste", title: "The Toothpaste Incident", uid: "ec2fd9bf14bee9bf87d04aadbfd97a3c" },
  { key: "remote", title: "Paradise Vacation Mode", uid: "9932713e6753befe2ebe7fb0fde0bc35" },
  { key: "headphones", title: "Beats Too Loud", uid: "8b696b5ba729ad660508951bced42dc1" },
  { key: "laundry", title: "Laundry Duty", uid: "4fc56d9ad5df8a932f855221f0110693" },
];

// Poster frame (grabbed a couple seconds in to avoid a black opening frame).
export function posterUrl(uid: string): string {
  return `https://${CF_CUSTOMER_CODE}.cloudflarestream.com/${uid}/thumbnails/thumbnail.jpg?time=2s&height=800`;
}
