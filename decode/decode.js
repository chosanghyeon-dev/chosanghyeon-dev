const fs = require('fs');
const path = require('path');

const input = process.argv[2] || 'cf.json';
const output = process.argv[3] || 'cf.decoded.json';

const tryDecode = (s) => {
  if (typeof s !== 'string') return s;
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(s) || s.length % 4 !== 0) return s;
  const decoded = Buffer.from(s, 'base64').toString('utf8');
  const reencoded = Buffer.from(decoded, 'utf8').toString('base64');
  if (reencoded !== s) return s;
  return decoded;
};

const walk = (node) => {
  if (Array.isArray(node)) return node.map(walk);
  if (node && typeof node === 'object') {
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, walk(v)]));
  }
  return tryDecode(node);
};

const data = JSON.parse(fs.readFileSync(path.resolve(input), 'utf8'));
fs.writeFileSync(path.resolve(output), JSON.stringify(walk(data), null, 2) + '\n');
console.log(`Decoded ${input} -> ${output}`);
