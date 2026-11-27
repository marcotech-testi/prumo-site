/**
 * Gera favicon, ícones e imagem OG a partir de assets/logo.
 * Uso: pnpm build:assets (os arquivos gerados são commitados).
 */
import { copyFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const FLORESTA = "#1E3227";
const PEDRA = "#E9E6DF";

async function og() {
  const logo = await sharp("assets/logo/png/prumo-logo-vertical-negativo.png")
    .resize({ height: 380 })
    .toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: FLORESTA } })
    .composite([{ input: logo, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile("src/app/opengraph-image.png");
}

async function icons() {
  const avatar = "assets/logo/png/prumo-avatar-redes.png";
  await sharp(avatar).resize(180, 180).png().toFile("src/app/apple-icon.png");
  await sharp(avatar).resize(192, 192).png().toFile("public/icon-192.png");
  await sharp(avatar).resize(512, 512).png().toFile("public/icon-512.png");
  await copyFile("assets/logo/prumo-simbolo-positivo.svg", "src/app/icon.svg");
}

/** favicon.ico 48×48 (ICO com PNG embutido), símbolo positivo sobre Pedra. */
async function favicon() {
  const symbol = await sharp("assets/logo/prumo-simbolo-positivo.svg", { density: 300 })
    .resize({ height: 44 })
    .toBuffer();
  const png = await sharp({ create: { width: 48, height: 48, channels: 4, background: PEDRA } })
    .composite([{ input: symbol, gravity: "center" }])
    .png()
    .toBuffer();
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  const entry = Buffer.alloc(16);
  entry.writeUInt8(48, 0);
  entry.writeUInt8(48, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(22, 12);
  await writeFile("src/app/favicon.ico", Buffer.concat([header, entry, png]));
}

Promise.all([og(), icons(), favicon()]).then(() =>
  console.log(
    "Ativos gerados: opengraph-image.png, apple-icon.png, icon.svg, favicon.ico, icon-192/512.png",
  ),
);
