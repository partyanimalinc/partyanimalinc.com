// Bijan Robinson "Life with a Mini-Me" advent series, hosted on Cloudflare Stream.
// Order: the two hero social cuts first, then the six mini-me "incidents".
// UIDs + customer code come from the Stream upload (scripts/_upload-stream.mjs).
export const CF_CUSTOMER_CODE = "customer-t663x3xn0d5w1cjh";

// `t` = the second in the clip to grab the poster frame from. Varied per clip so
// the thumbnails don't all look like the same talking-head frame.
export type AdventVideo = { key: string; title: string; uid: string; t: number };

export const ADVENT_VIDEOS: AdventVideo[] = [
  { key: "teenymates", title: "TeenyMates Advent Calendar", uid: "e9117f20b65890c892cceb2ed6b23b6b", t: 43 },
  { key: "squeezymates", title: "SqueezyMates Helmets", uid: "6d3798aa22cc9e03b92f17872a5a199a", t: 34 },
  { key: "cookie", title: "The Cookie Incident", uid: "c885188db2c799fd2f20fc57711c02f8", t: 13 },
  { key: "google", title: "The Super Bowl Search", uid: "0ddb83051b7ec5cd594db509c0fb62a7", t: 7 },
  { key: "toothpaste", title: "The Toothpaste Incident", uid: "ec2fd9bf14bee9bf87d04aadbfd97a3c", t: 15 },
  { key: "remote", title: "Paradise Vacation Mode", uid: "9932713e6753befe2ebe7fb0fde0bc35", t: 9 },
  { key: "headphones", title: "Beats Too Loud", uid: "8b696b5ba729ad660508951bced42dc1", t: 5 },
  { key: "laundry", title: "Laundry Duty", uid: "4fc56d9ad5df8a932f855221f0110693", t: 11 },
];

// Poster frame at a per-clip timestamp (avoids identical talking-head thumbnails).
export function posterUrl(uid: string, t = 2): string {
  return `https://${CF_CUSTOMER_CODE}.cloudflarestream.com/${uid}/thumbnails/thumbnail.jpg?time=${t}s&height=800`;
}
