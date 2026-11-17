import test from 'node:test';
import assert from 'node:assert/strict';
import { isClique } from '../src/graph.js';
test('triangle is a clique but missing an edge breaks the clique',()=>{
  const v=['A','B','C','D'];
  const e=[['A','B'],['B','C'],['A','C'],['C','D']];
  assert.equal(isClique(v,e,['A','B','C']),true);
  assert.equal(isClique(v,e,['A','B','D']),false);
  assert.equal(isClique(v,e,['A','A']),false);
});
