import test from 'node:test';
import assert from 'node:assert/strict';
import {NUMBERS, TARGET, evaluateSubsetSum} from '../src/subset-sum.js';

// Independently derived CNF truth table in x1,x2,x3 order.
// These expectations intentionally do not call CLAUSES or formulaSatisfied.
const truthTable = new Map([
  ['000', false], ['001', true], ['010', true], ['011', false],
  ['100', true],  ['101', true], ['110', false], ['111', false],
]);

test('every Boolean assignment agrees with an independent truth table', () => {
  for (const [bits, expected] of truthTable) {
    const assignment = [...bits].map(Number);
    const result = evaluateSubsetSum(assignment);
    assert.equal(result.formulaSatisfied, expected, 'CNF oracle: ' + bits);
    assert.equal(result.matchesTarget, expected, 'reduction oracle: ' + bits);
    assert.deepEqual(result.assignment, assignment);
    assert.equal(result.selected.filter(row => row.kind === 'variable').length, 3);
    assert.deepEqual(result.digits.slice(0,3), [1,1,1]);
    assert.ok(result.digits.every(digit => Number.isInteger(digit) && digit < 10),
      'No position may carry: ' + bits);
  }
});

test('the known satisfying assignment has an exact expected target', () => {
  const result = evaluateSubsetSum([0,0,1]);
  assert.deepEqual(result.digits, [1,1,1,4,4,4,4]);
  assert.equal(result.digits.join(''), TARGET);
  assert.deepEqual(result.clauseCounts, [1,2,3,1]);
});

test('each row has exactly seven decimal digits with no negative place values', () => {
  assert.equal(NUMBERS.length,14);
  for (const row of NUMBERS) {
    assert.match(row.digits, /^[0-9]{7}$/);
    assert.equal(row.digits.slice(0,3).split('').reduce((s,x) => s+Number(x),0) <= 1, true);
  }
});

test('invalid assignments reject missing, extra, and non-Boolean values', () => {
  for (const bad of [null, undefined, [], [0,1], [0,1,0,1], [0,2,1],
    [true,false,true], ['0','0','1'], [0,-1,1]]) {
    assert.throws(() => evaluateSubsetSum(bad), TypeError, String(bad));
  }
});

const vertices = ['A','B','C','D'];
const edges = [['A','B'],['B','C'],['C','A'],['C','D']];

test('empty and singleton sets are cliques; duplicates and unknown vertices are not', () => {
  assert.equal(isClique(vertices,edges,[]),true);
  for (const vertex of vertices) {
    assert.equal(isClique(vertices,edges,[vertex]),true);
  }
  assert.equal(isClique(vertices,edges,['A','A']),false);
  assert.equal(isClique(vertices,edges,['Z']),false);
});

test('all subsets agree with an independent pair-by-pair edge oracle', () => {
  for (let mask=0; mask<(1<<vertices.length); mask++) {
    const chosen=vertices.filter((_,i)=>mask&(1<<i));
    const expected=chosen.every((a,i)=>chosen.every((b,j)=>{
      if(i>=j)return true;
      return edges.some(([u,v]) => (u===a && v===b)||(u===b && v===a));
    }));
    assert.equal(isClique(vertices,edges,chosen),expected,chosen.join(','));
  }
});

test('edge order does not change clique membership', () => {
  assert.equal(isClique(vertices,edges,['A','B','C']),true);
  assert.equal(isClique(vertices,edges.slice().reverse().map(([a,b])=>[b,a]),['C','B','A']),true);
  assert.equal(isClique(vertices,edges,['A','B','D']),false);
});
