import { LANES, type Run } from './model';

type Color = readonly [number, number, number];
const rgb = (hex: number): Color => [(hex >> 16) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255];
const palette = {
  sky: rgb(0x859b91), dirt: rgb(0x9b8868), road: rgb(0x766d56), stripe: rgb(0xc7b68b),
  grass: rgb(0x677451), dark: rgb(0x303e37), olive: rgb(0x6b7950), helmet: rgb(0x6a7e50),
  skin: rgb(0xbc956e), boots: rgb(0x303833), pack: rgb(0x958466), orange: rgb(0xe5a26b),
  container: rgb(0x6c9991), rust: rgb(0xa96f4e), pit: rgb(0x262e2a), gold: rgb(0xf1cf80),
};

// Flat face lighting and simple geometry give a deliberately early-console look.
const cube = new Float32Array([
  ...face([[-.5,.5,-.5],[.5,.5,-.5],[.5,.5,.5],[-.5,.5,.5]], 1.12),
  ...face([[-.5,-.5,.5],[.5,-.5,.5],[.5,-.5,-.5],[-.5,-.5,-.5]], .5),
  ...face([[-.5,-.5,-.5],[.5,-.5,-.5],[.5,.5,-.5],[-.5,.5,-.5]], .82),
  ...face([[.5,-.5,.5],[-.5,-.5,.5],[-.5,.5,.5],[.5,.5,.5]], .68),
  ...face([[-.5,-.5,.5],[-.5,-.5,-.5],[-.5,.5,-.5],[-.5,.5,.5]], .7),
  ...face([[.5,-.5,-.5],[.5,-.5,.5],[.5,.5,.5],[.5,.5,-.5]], .95),
]);
const diamond = new Float32Array([
  ...triangle([0,.5,0],[-.5,0,0],[0,0,-.5],1.1),
  ...triangle([0,.5,0],[0,0,-.5],[.5,0,0],1.25),
  ...triangle([0,.5,0],[.5,0,0],[0,0,.5],.9),
  ...triangle([0,.5,0],[0,0,.5],[-.5,0,0],.75),
  ...triangle([0,-.5,0],[0,0,-.5],[-.5,0,0],.7),
  ...triangle([0,-.5,0],[.5,0,0],[0,0,-.5],.9),
  ...triangle([0,-.5,0],[0,0,.5],[.5,0,0],.65),
  ...triangle([0,-.5,0],[-.5,0,0],[0,0,.5],.6),
]);
const groundPlane = new Float32Array(face([[-.5,0,-.5],[.5,0,-.5],[.5,0,.5],[-.5,0,.5]],1));
const hill = new Float32Array([
  ...triangle([0,1,0],[-.5,0,-.5],[.5,0,-.5],.82),
  ...triangle([0,1,0],[.5,0,-.5],[.5,0,.5],1.05),
  ...triangle([0,1,0],[.5,0,.5],[-.5,0,.5],.7),
  ...triangle([0,1,0],[-.5,0,.5],[-.5,0,-.5],.65),
]);
function triangle(a: number[], b: number[], c: number[], light: number): number[] {
  return [a[0],a[1],a[2],light,b[0],b[1],b[2],light,c[0],c[1],c[2],light];
}
function face(points: number[][], light: number): number[] {
  return [...triangle(points[0],points[1],points[2],light), ...triangle(points[0],points[2],points[3],light)];
}

export class Renderer {
  private data = new Float32Array(180_000);
  private length = 0;
  private groundEnd = 0;
  private gl: WebGLRenderingContext | null;
  private ctx: CanvasRenderingContext2D | null = null;
  private program: WebGLProgram | null = null;
  private buffer: WebGLBuffer | null = null;
  private projection: WebGLUniformLocation | null = null;
  private aspect = .5625;
  private quality = 1;
  readonly backend: 'webgl' | 'canvas';

  constructor(readonly canvas: HTMLCanvasElement) {
    this.gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: true, stencil: false, powerPreference: 'low-power' });
    this.backend = this.gl ? 'webgl' : 'canvas';
    if (this.gl) this.initializeGL();
    else {
      this.ctx = canvas.getContext('2d', { alpha: false });
      if (!this.ctx) throw new Error('Canvas is unavailable in this browser.');
    }
  }

  private initializeGL(): void {
    const gl = this.gl!;
    const vertex = gl.createShader(gl.VERTEX_SHADER)!;
    const fragment = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(vertex, `
      attribute vec3 position; attribute vec3 color;
      uniform vec2 projection; varying vec3 tint; varying float depth;
      void main() {
        float y = position.y - 5.4; float z = position.z + 9.8;
        float cy = y * .973666 + z * .227978;
        float cz = z * .973666 - y * .227978;
        gl_Position = vec4(position.x * projection.x, cy * projection.y, 1.00167 * cz - .200167, cz);
        tint = color; depth = cz;
      }
    `);
    gl.shaderSource(fragment, `
      precision mediump float; varying vec3 tint; varying float depth;
      void main() {
        float fog = smoothstep(28.0, 105.0, depth);
        gl_FragColor = vec4(mix(tint, vec3(.52157,.60784,.56863), fog), 1.0);
      }
    `);
    gl.compileShader(vertex); gl.compileShader(fragment);
    this.program = gl.createProgram()!;
    gl.attachShader(this.program, vertex); gl.attachShader(this.program, fragment);
    gl.linkProgram(this.program);
    gl.deleteShader(vertex); gl.deleteShader(fragment);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) throw new Error('Graphics could not start. Please reload.');
    gl.useProgram(this.program);
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.data.byteLength, gl.DYNAMIC_DRAW);
    for (const [name, offset] of [['position', 0], ['color', 12]] as const) {
      const location = gl.getAttribLocation(this.program, name);
      gl.enableVertexAttribArray(location); gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 24, offset);
    }
    this.projection = gl.getUniformLocation(this.program, 'projection');
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(...palette.sky, 1);
  }

  resize(quality = this.quality): void {
    this.quality = quality;
    const { width, height } = this.canvas.getBoundingClientRect();
    if (!width || !height) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
    const cap = this.backend === 'canvas' ? 580 : 1000;
    const scale = Math.min(ratio, cap / Math.max(width, height));
    const w = Math.max(1, Math.round(width * scale));
    const h = Math.max(1, Math.round(height * scale));
    if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; }
    this.aspect = width / height;
    this.gl?.viewport(0, 0, w, h);
  }

  private mesh(mesh: Float32Array, x: number, y: number, z: number, w: number, h: number, d: number, color: Color, rx = 0, ry = 0): void {
    const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
    for (let i = 0; i < mesh.length; i += 4) {
      const px = mesh[i] * w, py = mesh[i+1] * h, pz = mesh[i+2] * d;
      const ty = py * cx - pz * sx, tz = py * sx + pz * cx;
      const light = mesh[i+3];
      if (this.length + 6 > this.data.length) return;
      this.data[this.length++] = x + px * cy + tz * sy;
      this.data[this.length++] = y + ty;
      this.data[this.length++] = z + tz * cy - px * sy;
      this.data[this.length++] = color[0] * light;
      this.data[this.length++] = color[1] * light;
      this.data[this.length++] = color[2] * light;
    }
  }

  private box(x: number, y: number, z: number, w: number, h: number, d: number, color: Color, rx = 0, ry = 0): void {
    this.mesh(cube, x, y, z, w, h, d, color, rx, ry);
  }
  private plane(x: number, y: number, z: number, w: number, d: number, color: Color): void {
    this.mesh(groundPlane,x,y,z,w,0,d,color);
  }

  render(run: Run, reducedMotion: boolean): void {
    this.length = 0;
    const distance = run.distance;
    this.plane(0,-.07,40,160,130,palette.dirt);
    this.plane(0,-.015,40,7.1,130,palette.road);
    for (const x of [-3.7, 3.7]) this.plane(x,.02,40,.15,130,palette.stripe);
    for (let i = 0; i < 19; i++) {
      const z = i * 6.5 - distance % 6.5 - 9;
      for (const x of [-1.075, 1.075]) this.plane(x,.002,z,.055,2.8,palette.stripe);
    }
    this.groundEnd = this.length;
    // Recycled scenery: constant object count, no textures, no remote assets.
    for (let i = 0; i < 13; i++) {
      const z = i * 9 - distance % 9 - 10;
      const sign = i % 2 ? -1 : 1;
      this.box(sign * 5.3,.3,z,1.3,.6,.7,palette.pack);
      this.box(sign * 5.3,.67,z,.8,.16,.6,palette.pack);
      this.mesh(hill,sign * (9 + i % 3 * 3),-.04,z,7,4,6,palette.grass);
      if (i % 3 === 0) {
        this.box(-sign * 6.3,1.5,z,.12,3,.12,palette.dark);
        this.box(-sign * 5.9,2.5,z,.85,.55,.07,palette.orange);
      }
    }
    for (let i = 0; i < 9; i++) this.mesh(hill,(i-4)*15,-.04,95+i%3*4,30,14+i%3*5,25,palette.grass);
    for (const obstacle of run.obstacles) {
      if (obstacle.z < -5 || obstacle.z > 94) continue;
      const x = LANES[obstacle.lane], z = obstacle.z;
      if (obstacle.kind === 'container') {
        this.box(x,.6,z,1.8,1.2,3.6,palette.container);
        for (const side of [-1,1]) for (let rib = 0; rib < 5; rib++) this.box(x+side*.91,.65,z-1.4+rib*.7,.045,.95,.07,palette.stripe);
        this.box(x,.65,z-1.81,.06,1.05,.03,palette.dark);
        this.box(x,.09,z-1.83,1.65,.14,.03,palette.orange);
      } else if (obstacle.kind === 'tank') {
        for (const side of [-1,1]) {
          this.box(x+side*.74,.36,z,.37,.65,4.3,palette.dark);
          for (let wheel = 0; wheel < 4; wheel++) this.mesh(diamond,x+side*.94,.34,z-1.5+wheel, .08,.5,.6,palette.olive);
        }
        this.box(x,.77,z,1.65,.58,3.3,palette.olive);
        this.box(x,1.2,z+.15,1.15,.5,1.6,palette.helmet);
        this.box(x,1.5,z+.25,.75,.4,.9,palette.helmet);
        this.box(x,1.27,z-1.25,.16,.16,2,palette.dark);
        this.box(x-.46,.84,z-1.67,.26,.17,.06,palette.orange);
      } else if (obstacle.kind === 'trench') {
        this.box(x,.012,z,1.95,.018,4.2,palette.pit);
        for (const side of [-1,1]) {
          this.box(x+side*1.02,.07,z,.15,.13,4.4,palette.dirt);
          this.box(x,.02,z+side*2.14,1.95,.03,.1,palette.orange);
        }
        this.box(x,.024,z,1.65,.015,.09,palette.dark);
      } else {
        this.mesh(diamond,x,.36,z,.7,.85,.7,palette.olive,0,run.elapsed);
        this.box(x,.78,z,.21,.18,.21,palette.dark);
        this.box(x+.12,.84,z,.22,.06,.08,palette.orange,0,.4);
        this.box(x,.025,z,1.2,.02,1.2,palette.rust);
      }
    }
    for (const token of run.pickups) if (!token.collected && token.z > -3 && token.z < 90) {
      this.mesh(diamond,LANES[token.lane],1.05,token.z,.55,.8,.18,palette.gold,0,reducedMotion ? .4 : run.elapsed * 2);
    }
    const p = run.player, t = run.elapsed * 12;
    const stride = p.grounded ? Math.sin(t) * .65 : -.35;
    const bob = p.grounded && !reducedMotion ? Math.abs(Math.sin(t)) * .055 : 0;
    const y = Math.max(-1.3,p.y) + bob;
    const x = p.x;
    this.mesh(diamond,x,.02,0,.85,.02,1.15,palette.dark);
    // Animated soldier: boots, legs, webbing, backpack and a faceted helmet.
    for (const side of [-1,1]) {
      const angle = stride * side;
      const z = Math.sin(angle) * .27;
      this.box(x+side*.18,y+.47,z,.23,.7,.25,palette.olive,angle);
      this.box(x+side*.18,y+.12,z*1.6-.04,.27,.22,.42,palette.boots,angle*.3);
      this.box(x+side*.44,y+1.12,-z*.6,.2,.65,.23,palette.olive,-angle*.8);
      this.box(x+side*.44,y+.8,-z,.18,.19,.19,palette.skin);
    }
    this.box(x,y+1.12,0,.65,.72,.42,palette.olive);
    this.box(x,y+.82,0,.69,.13,.46,palette.dark);
    this.box(x,y+1.22,-.29,.48,.6,.22,palette.pack);
    this.box(x,y+1.23,-.416,.09,.5,.025,palette.dark);
    this.box(x,y+1.67,0,.39,.39,.38,palette.skin);
    this.mesh(diamond,x,y+1.89,0,.68,.48,.65,palette.helmet);
    this.box(x,y+1.76,0,.62,.13,.62,palette.helmet);
    this.box(x+.35,y+1.3,-.08,.05,.13,.22,palette.orange);
    if (this.gl) {
      const gl = this.gl;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      // Keep all lanes in frame on tall phones, including the apex of a jump.
      const focal = 1.95 * Math.min(1,this.aspect/.5625);
      gl.uniform2f(this.projection, focal / this.aspect, focal);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.data.subarray(0,this.length));
      gl.drawArrays(gl.TRIANGLES, 0, this.length / 6);
    } else this.paintCanvas();
  }

  private paintCanvas(): void {
    const ctx = this.ctx!, { width, height } = this.canvas;
    const focal = 1.95 * Math.min(1,this.aspect/.5625);
    ctx.fillStyle = '#859b91'; ctx.fillRect(0,0,width,height);
    const triangles: { depth: number; points: number[]; color: number[]; ground: boolean; order: number }[] = [];
    for (let i = 0; i < this.length; i += 18) {
      const points: number[] = []; let depth = 0;
      const camera: number[][] = [];
      for (let v = 0; v < 3; v++) {
        const n = i + v * 6, y = this.data[n+1]-5.4, z = this.data[n+2]+9.8;
        const cy = y * .973666 + z * .227978, cz = z * .973666 - y * .227978;
        camera.push([this.data[n],cy,cz]);
      }
      // Clip near-plane crossings instead of dropping the ground beneath you.
      const clipped: number[][] = [];
      for (let v = 0; v < 3; v++) {
        const a = camera[v], b = camera[(v+1)%3];
        if (a[2] >= .1) clipped.push(a);
        if ((a[2] >= .1) !== (b[2] >= .1)) {
          const t = (.1-a[2])/(b[2]-a[2]);
          clipped.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,.1]);
        }
      }
      if (clipped.length < 3) continue;
      for (const [x,y,z] of clipped) {
        points.push((x*focal/this.aspect/z+1)*width/2,(1-y*focal/z)*height/2);
        depth += z/clipped.length;
      }
      const t = Math.max(0,Math.min(1,(depth-28)/77)), fog = t*t*(3-2*t);
      const color = palette.sky.map((sky,c) => Math.round(Math.min(1,i<this.groundEnd ? this.data[i+3+c] : this.data[i+3+c]*(1-fog)+sky*fog)*255));
      triangles.push({ depth, points, color, ground:i<this.groundEnd, order:i });
    }
    triangles.sort((a,b) => a.ground !== b.ground ? (a.ground ? -1 : 1) : a.ground ? a.order-b.order : b.depth-a.depth);
    const groundFills = new Map<string,CanvasGradient>();
    for (const { points: p, color, ground } of triangles) {
      const tint = `rgb(${color.join(',')})`;
      if (ground) {
        let gradient = groundFills.get(tint);
        if (!gradient) {
          gradient = ctx.createLinearGradient(0,height*.25,0,height*.7);
          gradient.addColorStop(0,'#859b91'); gradient.addColorStop(1,tint);
          groundFills.set(tint,gradient);
        }
        ctx.fillStyle = gradient;
      } else ctx.fillStyle = tint;
      ctx.beginPath(); ctx.moveTo(p[0],p[1]);
      for (let v = 2; v < p.length; v += 2) ctx.lineTo(p[v],p[v+1]);
      ctx.closePath(); ctx.fill();
    }
  }

  dispose(): void {
    if (this.gl) { this.gl.deleteBuffer(this.buffer); this.gl.deleteProgram(this.program); }
  }
}
