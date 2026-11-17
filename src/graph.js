/** Test whether the indicated vertices form a clique in an undirected graph. */
export function isClique(vertices, edges, selected) {
  const known = new Set(vertices);
  const chosen = [...new Set(selected)];
  if (chosen.length !== selected.length || chosen.some(v => !known.has(v))) return false;
  const encoded = new Set(edges.flatMap(([a,b]) => [`${a}\u0000${b}`,`${b}\u0000${a}`]));
  for (let i=0;i<chosen.length;i++) for(let j=i+1;j<chosen.length;j++) {
    if(!encoded.has(`${chosen[i]}\u0000${chosen[j]}`)) return false;
  }
  return true;
}
