#!/usr/bin/env node
/**
 * Build, deploy guestbook to testnet, regenerate bindings, write frontend/.env.local
 * Requires: stellar CLI, funded identity `mywallet` (or set DEPLOYER=mywallet)
 */
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const deployer = process.env.DEPLOYER || "mywallet";
const network = process.env.STELLAR_NETWORK || "testnet";

function run(cmd, opts = {}) {
  console.log(`> ${cmd}`);
  execSync(cmd, { stdio: "inherit", cwd: root, ...opts });
}

run("stellar contract build");

const nativeAsset = execSync(
  `stellar contract id asset --network ${network} --asset native`,
  { encoding: "utf8", cwd: root }
).trim();

const wasm = join(root, "target/wasm32v1-none/release/guestbook.wasm");
const admin = execSync(`stellar keys address ${deployer}`, {
  encoding: "utf8",
  cwd: root,
}).trim();

const contractId = execSync(
  `stellar contract deploy --wasm ${wasm} --source ${deployer} --network ${network} -- --admin ${deployer} --tip_token ${nativeAsset}`,
  { encoding: "utf8", cwd: root }
)
  .trim()
  .split("\n")
  .pop()
  .trim();

console.log(`Contract ID: ${contractId}`);

mkdirSync(join(root, "packages"), { recursive: true });
run(
  `stellar contract bindings typescript --wasm ${wasm} --output-dir packages/guestbook_client --overwrite`
);
run("npm run build -w guestbook_client");

const envPath = join(root, "frontend/.env.local");
const env = `NEXT_PUBLIC_GUESTBOOK_CONTRACT_ID=${contractId}
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
NEXT_PUBLIC_NATIVE_ASSET_CONTRACT=${nativeAsset}
NEXT_PUBLIC_ADMIN_ADDRESS=${admin}
`;
writeFileSync(envPath, env);
console.log(`Wrote ${envPath}`);
