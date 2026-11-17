/** Independent, executable model of the standard 3-CNF-SAT to SUBSET-SUM example.
 * The seven decimal places encode x1,x2,x3,C1,C2,C3,C4. No carries occur. */
export const TARGET='1114444';
export const CLAUSES=[
  a => !!(a[0] || !a[1] || !a[2]),
  a => !!(!a[0] || !a[1] || !a[2]),
  a => !!(!a[0] || !a[1] || a[2]),
  a => !!(a[0] || a[1] || a[2])
];
export const FORMULAS=[
  'x1 OR NOT x2 OR NOT x3',
  'NOT x1 OR NOT x2 OR NOT x3',
  'NOT x1 OR NOT x2 OR x3',
  'x1 OR x2 OR x3'
];
const choices=[
  ['v1','1001001',0,1], ["v1'",'1000110',0,0],
  ['v2','0100001',1,1], ["v2'",'0101110',1,0],
  ['v3','0010011',2,1], ["v3'",'0011100',2,0]
];
export const NUMBERS=[
  ...choices.map(([label,digits,variable,value])=>({label,digits,kind:'variable',variable,value})),
  ...Array.from({length:4},(_,i)=>[
    {label:`s${i+1}`,digits:'0'.repeat(3+i)+'1'+'0'.repeat(3-i),kind:'slack',clause:i,amount:1},
    {label:`s${i+1}'`,digits:'0'.repeat(3+i)+'2'+'0'.repeat(3-i),kind:'slack',clause:i,amount:2}
  ]).flat()
];
export function evaluateSubsetSum(assignment) {
  if (!Array.isArray(assignment) || assignment.length !== 3 || assignment.some(v=>v!==0 && v!==1)) {
    throw new TypeError('Assignment must be an array of three Boolean digits, 0 or 1.');
  }
  const picked=NUMBERS.filter(r=>r.kind==='variable' && assignment[r.variable]===r.value);
  const clauseCounts=[0,1,2,3].map(i=>picked.reduce((sum,r)=>sum+Number(r.digits[3+i]),0));
  const slackChosen=[];
  for(let i=0;i<4;i++) {
    const need=4-clauseCounts[i];
    const options=NUMBERS.filter(r=>r.kind==='slack' && r.clause===i);
    if(need===1) slackChosen.push(options[0]);
    if(need===2) slackChosen.push(options[1]);
    if(need>=3) slackChosen.push(...options); // For need=4, max available is 3.
  }
  const selected=[...picked,...slackChosen];
  const digits=Array.from({length:7},(_,i)=>selected.reduce((sum,r)=>sum+Number(r.digits[i]),0));
  const clauses=CLAUSES.map(fn=>fn(assignment));
  const matchesTarget=digits.join('')===TARGET;
  return {assignment:[...assignment],selected,selectedLabels:selected.map(r=>r.label),digits,clauseCounts,clauses,formulaSatisfied:clauses.every(Boolean),matchesTarget};
}
