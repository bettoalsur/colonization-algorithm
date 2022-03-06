

class Leaf {
  constructor() {
    
    let cy = ( height-100  )/2;
    let cx = width/2;
    let r = random(7,cy);
    let th = random(2*PI);
    this.pos = createVector(cx + r*cos(th),cy + r*sin(th));
    
    //this.pos = createVector(random(width),random(height-100));
    
    this.active = true;
  }
  
  show() {
    if (this.active) {
      stroke(100,255,100,20);
    } else {
      stroke(255,255,100,20);
    }
    strokeWeight(8);
    noFill();
    point(this.pos.x,this.pos.y)
  }
}

class Branch {
  constructor (begin, end) {
    this.begin = begin;
    this.end = end;
    this.dir = p5.Vector.sub(this.end,this.begin).normalize();
    this.influenced = false;
  }
  
  show(thickness) {
    stroke(157);
    strokeWeight(thickness);
    noFill();
    line(this.begin.x,this.begin.y,this.end.x,this.end.y);
  }
  
  addBranch () {
    let newDir = this.dir.copy();
    newDir.setMag(len);
    let newEnd = p5.Vector.add(this.end,newDir);
    branches.push(new Branch( this.end, newEnd ));
    this.dir = p5.Vector.sub(this.end,this.begin).normalize();
    this.influenced = false;
  }
    
  
}

let dimx = window.innerWidth;
let dimy = window.innerHeight;
let dim = Math.min(dimx,dimy);

let branches = [];
let leaves = [];
let len = 10;
let minRad = 12;
let maxRad = 400;

function setup() {
  createCanvas(dim, dim);
  for (let i = 0 ; i < 1000 ; i++) {
    leaves.push(new Leaf());
  }
  
  let begin = createVector(width/2,height);
  let end = createVector(width/2,height-len);
  branches.push(new Branch(begin,end));
  
  let current = branches[branches.length-1];
  let found = false;
  
  while (!found) {
    
    for (let leaf of leaves) {
      let distance = p5.Vector.sub(leaf.pos,current.end).mag();
      if (distance <= maxRad ){
        found = true;
        break;
      }
    }
    if (!found) {
      current.addBranch();
      current = branches[branches.length-1];
    }
    
  }
  
}

function draw() {
  background(15);
  
  for (let leaf of leaves) {
    leaf.show();
  }
  
  growth();
  
  for (let i = 0 ; i < branches.length ; i++){
    let branch = branches[i];
    let thickness = map(i,0,branches.length-1,4,0);
    branch.show(thickness);
  }
  
}

function growth() {
  
  let activeLeaves = leaves.filter(leaf => leaf.active);
  
  for (let leaf of activeLeaves) {
    let minDistance = max(dimx,dimy);
    let closestBranch = null;
    
    for (let branch of branches) {
      
      let distance = p5.Vector.sub(leaf.pos,branch.end).mag();
      
      if (distance < minRad) {
        leaf.active = false;
        closestBranch = null;
        break;
      } 
      if (distance < minDistance && distance <= maxRad) {
        minDistance = distance;
        closestBranch = branch;
      }
      
    }
    
    if (closestBranch != null) {
      closestBranch.influenced = true;
      let force = p5.Vector.sub(leaf.pos,closestBranch.end);
      force.normalize();
      let randomForce = p5.Vector.random2D().setMag(0.15);
      closestBranch.dir.add(force.add(randomForce));
    }
    
  } // end of for leaves
  
  let influencedBranches = branches.filter(branch => branch.influenced);
  
  if (influencedBranches.length == 0) return;
  
  for (let branch of influencedBranches) {
    branch.dir.normalize();
    branch.addBranch();
  }
  
  
}
