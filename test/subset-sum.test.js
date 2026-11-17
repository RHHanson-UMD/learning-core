import test from 'node:test';
import assert from 'node:assert/strict';
import {TARGET, NUMBERS, evaluateSubsetSum} from '../src/subset-sum.js';
test('the published construction has 14 numbers and no digit carry',()=>{
  assert.equal(NUMBERS.length,14);
  assert.equal(TARGET,'1114444');
  for(let bits=0;bits<8;bits++) {
    const a=[bits&1,(bits>>1)&1,(bits>>2)&1];
    const r=evaluateSubsetSum(a);
    assert.equal(r.matchesTarget,r.formulaSatisfied,`Failed assignment ${a}`);
    assert.ok(r.digits.every(n=>n<=6));
    assert.deepEqual(r.digits.slice(0,3),[1,1,1]);
  }
});
test('the textbook satisfying assignment reaches the target',()=>{
  const r=evaluateSubsetSum([0,0,1]);
  assert.equal(r.matchesTarget,true);
  assert.equal(r.digits.join(''),TARGET);
  assert.deepEqual(r.clauseCounts,[1,2,3,1]);
});
test('invalid assignments throw',()=>{
  assert.throws(()=>evaluateSubsetSum([1,0]),TypeError);
  assert.throws(()=>evaluateSubsetSum([1,2,0]),TypeError);
});
