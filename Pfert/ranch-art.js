/* Original pixel sprites for the ranch and in-flight egg pickups. */
const PfertRanchArt=(()=>{
 const ink='#211a32',leather='#654043',trim=['#efd7a1','#bdede5','#e7b4f2','#ffe28c'];
 const egg=[
  '.......####.......','......#llll#......','.....#lssssq#.....','....#lssssssq#....',
  '...#lssssssssq#...','...#lssssssssq#...','..#lssssssssssq#..','..#sssssssssssq#..',
  '.#lssssssssssssq#.','.#lssssssssssssq#.','.#ssssssssssssqq#.','.#ssssssssssssqq#.',
  '.#qssssssssssqqq#.','..#qqsssssssqqq#..','...#qqqqqqqqqq#...','....##########....'
 ];
 const foal=[
  '........................','......##................','.....#ll#...............','..##.#ls#...............',
  '.#ll##ssw#..............','.#ssssssww#.............','.#lkslssww#.......#####.','.#llllssww#.....##wwww#.',
  '#llllsssww######ssssww#.','#lqqllsswwwlsssssssww#..','.####qsswwlsssssssss#...',
  '....#qssslssssssssss#...','....#qssssssssssssss#...','.....#qqssssssssssqq#...',
  '.....##qqqqqqqqqqq#.....','......#q###...##q##.....','......#q#.......#q#.....',
  '.....#ww#.......#ww#....','.....####.......####....'
 ];
 const markings=[
  ['.##.','####','####','.##.'],
  ['####','#..#','#..#','####'],
  ['..#..','.#.#.','#...#','.#.#.','..#..'],
  ['..#..','..#..','#####','..#..','..#..']
 ];
 const crests=[
  ['.#.','###','.#.'],
  ['#####','#...#','#####'],
  ['..#..','.#.#.','#...#','.#.#.','..#..'],
  ['#.#.#','#####','#####']
 ];
 function pixels(ctx,rows,x,y,palette){
  for(let row=0;row<rows.length;row++)for(let col=0;col<rows[row].length;col++){
   const color=palette[rows[row][col]];
   if(color){ctx.fillStyle=color;ctx.fillRect(x+col,y+row,1,1)}
  }
 }
 function draw(ctx,item,x,y,scale=1,hatched=false){
  const {palette,pattern}=PfertRanch.traits(item),colors=PfertRanch.palettes[palette];
  const rarity=PfertRanch.tierOf(item.tier)?.glyph||1;
  ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(scale,scale);

  ctx.fillStyle='#1d173b65';ctx.fillRect(hatched?-12:-7,8,hatched?24:14,2);
  pixels(ctx,hatched?foal:egg,hatched?-12:-9,hatched?-10:-8,
   {'#':ink,l:colors.light,s:colors.shell,q:colors.shade,w:leather,k:'#fff1c2'});
  pixels(ctx,markings[pattern],hatched?1:-2,hatched?0:-1,{'#':colors.shade});
  if(!hatched){
   // A different rim extends each tier's outline independently of the inherited pattern.
   const rim=crests[rarity-1],left=rarity===1?-1:-2,top=-8-(rarity===1?0:1);
   for(const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]])pixels(ctx,rim,left+dx,top+dy,{'#':ink});
   pixels(ctx,rim,left,top,{'#':trim[rarity-1]});
  }
  ctx.restore();
 }
 return {draw};
})();
