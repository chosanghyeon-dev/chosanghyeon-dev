const fs = require('fs');
const path = require('path');

const input = process.argv[2] || 'decode/cf.decoded.json';
const output = process.argv[3] || 'cf.json';

const encode = (s) => {
  if (typeof s !== 'string') return s;
  return Buffer.from(s, 'utf8').toString('base64');
};

const walk = (node) => {
  if (Array.isArray(node)) return node.map(walk);
  if (node && typeof node === 'object') {
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, walk(v)]));
  }
  return encode(node);
};

const data = JSON.parse(fs.readFileSync(path.resolve(input), 'utf8'));
fs.writeFileSync(path.resolve(output), JSON.stringify(walk(data), null, 2) + '\n');
console.log(`Encoded ${input} -> ${output}`);
