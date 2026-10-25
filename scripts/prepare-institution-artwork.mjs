import sharp from "sharp";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";

// Owner-supplied artwork. Crop transparent margins, never redraw a bank mark.
const sources = [
  ["maybank", "01_37_20 PM-4", [315, 409, 56, 56]],
  ["cimb", "01_37_20 PM-4", [655, 409, 56, 56]],
  ["rhb", "01_37_20 PM-4", [315, 525, 56, 56]],
  ["tng", "01_37_20 PM-4", [655, 525, 56, 56]],
  ["grabpay", "01_37_20 PM-4", [315, 640, 56, 56]],
  ["netflix", "01_37_18 PM-3", [443, 647, 16, 24]],
  ["rft-leaf", "01_37_20 PM-4", [28, 21, 35, 47]],
];
await fs.mkdir("public/institutions", { recursive: true });
const receipt = [];
for (const [name, suffix, [left, top, width, height]] of sources) {
  const source = `assets/ChatGPT Image Oct 24, 2026, ${suffix}.png`;
  const original = await fs.readFile(source);
  const output = await sharp(original)
    .extract({ left, top, width, height })
    .png({ compressionLevel: 9 })
    .toBuffer();
  const destination = `public/institutions/${name}.png`;
  await fs.writeFile(destination, output);
  receipt.push({
    source,
    destination,
    crop: { left, top, width, height },
    sourceSha256: createHash("sha256").update(original).digest("hex"),
    outputSha256: createHash("sha256").update(output).digest("hex"),
  });
}
await fs.writeFile(
  "public/institutions/provenance.json",
  JSON.stringify(receipt, null, 2) + "\n",
);
