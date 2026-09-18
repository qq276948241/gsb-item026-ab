'use strict';

const WEIGHTS = {
  '外形': 25,
  '汤色': 10,
  '香气': 25,
  '滋味': 30,
  '叶底': 10,
};

const ERROR_MESSAGE = '没法审评：请给出五项里的四项或五项，每项一个零到一百的整数，不能重复。';

function parseArgs(argv) {
  if (argv.length !== 4 && argv.length !== 5) {
    return null;
  }
  const scores = {};
  for (const arg of argv) {
    const match = /^(外形|汤色|香气|滋味|叶底)([0-9]+)$/.exec(arg);
    if (match === null) {
      return null;
    }
    const name = match[1];
    if (Object.prototype.hasOwnProperty.call(scores, name)) {
      return null;
    }
    const score = Number(match[2]);
    if (score < 0 || score > 100) {
      return null;
    }
    scores[name] = score;
  }
  return scores;
}

function computeTotal(scores) {
  let numerator = 0;
  let denominator = 0;
  for (const name of Object.keys(scores)) {
    numerator += scores[name] * WEIGHTS[name];
    denominator += WEIGHTS[name];
  }
  // 四舍五入到两位小数（正好一半进一位），全程整数运算。
  const rounded = Math.floor((2 * numerator * 100 + denominator) / (2 * denominator));
  const integerPart = Math.floor(rounded / 100);
  const fractionPart = String(rounded % 100).padStart(2, '0');
  return integerPart + '.' + fractionPart;
}

function main(argv) {
  const scores = parseArgs(argv);
  if (scores === null) {
    process.stderr.write(ERROR_MESSAGE + '\n');
    process.exitCode = 1;
    return;
  }
  process.stdout.write('总分 ' + computeTotal(scores) + '\n');
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { WEIGHTS, ERROR_MESSAGE, parseArgs, computeTotal, main };
