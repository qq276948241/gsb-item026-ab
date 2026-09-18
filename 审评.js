'use strict';

const WEIGHTS = {
  '外形': 25,
  '汤色': 10,
  '香气': 25,
  '滋味': 30,
  '叶底': 10,
};

const ERROR_MESSAGE = '没法审评：请给出五项里的四项或五项，每项一个零到一百的整数，不能重复';

function fail() {
  process.stderr.write(ERROR_MESSAGE + '\n');
  process.exitCode = 1;
}

function main(argv) {
  if (argv.length !== 4 && argv.length !== 5) {
    fail();
    return;
  }

  const seen = new Set();
  let numerator = 0;
  let denominator = 0;

  for (const segment of argv) {
    const match = /^([^0-9]+)([0-9]+)$/.exec(segment);
    if (!match) {
      fail();
      return;
    }
    const name = match[1];
    const weight = WEIGHTS[name];
    if (weight === undefined || seen.has(name)) {
      fail();
      return;
    }
    const score = Number(match[2]);
    if (!Number.isSafeInteger(score) || score < 0 || score > 100) {
      fail();
      return;
    }
    seen.add(name);
    numerator += score * weight;
    denominator += weight;
  }

  // 先用整数算：总分*100 四舍五入（正好一半进一位）
  const scaled = Math.floor((2 * numerator * 100 + denominator) / (2 * denominator));
  const integerPart = Math.floor(scaled / 100);
  const fractionPart = String(scaled % 100).padStart(2, '0');
  process.stdout.write('总分 ' + integerPart + '.' + fractionPart + '\n');
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { main, WEIGHTS, ERROR_MESSAGE };
