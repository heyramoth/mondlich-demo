var S = Object.defineProperty;
var z = (v, i, e) => i in v ? S(v, i, { enumerable: !0, configurable: !0, writable: !0, value: e }) : v[i] = e;
var l = (v, i, e) => z(v, typeof i != "symbol" ? i + "" : i, e);
class x {
}
class I {
}
class P extends I {
  update(i, e, s) {
    const a = e * 3, t = e * 3;
    s.lives[e] -= i, s.sizes[e] -= i * s.decays[e];
    const u = 0.47, d = 1.22, y = Math.PI / 1e4;
    let n = -0.5 * u * y * d * s.velocities[t] * s.velocities[t] * s.velocities[t] / Math.abs(s.velocities[t]), o = -0.5 * u * y * d * s.velocities[t + 2] * s.velocities[t + 2] * s.velocities[t + 2] / Math.abs(s.velocities[t + 2]), h = -0.5 * u * y * d * s.velocities[t + 1] * s.velocities[t + 1] * s.velocities[t + 1] / Math.abs(s.velocities[t + 1]);
    n = isNaN(n) ? 0 : n, h = isNaN(h) ? 0 : h, o = isNaN(o) ? 0 : o;
    const c = n / s.masses[e], r = s.gravities[e] + h / s.masses[e], g = o / s.masses[e];
    s.velocities[t] += c * i, s.velocities[t + 1] += r * i, s.velocities[t + 2] += g * i, s.positions[a] += s.velocities[t] * i * 100, s.positions[a + 1] += s.velocities[t + 1] * i * 100, s.positions[a + 2] += s.velocities[t + 2] * i * 100;
  }
  reset(i, e) {
    const s = i * 3, a = i * 3, t = i * 3;
    e.positions[s] = 0, e.positions[s + 1] = 0, e.positions[s + 2] = 0, e.velocities[a] = 0, e.velocities[a + 1] = 0, e.velocities[a + 2] = 0, e.masses[i] = 1, e.aliveStatus[i] = 0, e.sizes[i] = 0, e.decays[i] = 0, e.lives[i] = 0, e.gravities[i] = -9.82, e.colors[t] = 1, e.colors[t + 1] = 1, e.colors[t + 2] = 1;
  }
}
class A extends x {
  constructor(e, s) {
    super();
    l(this, "positions");
    l(this, "velocities");
    l(this, "sizes");
    l(this, "masses");
    l(this, "decays");
    l(this, "lives");
    l(this, "gravities");
    l(this, "aliveStatus");
    l(this, "colors");
    l(this, "physics");
    this.particlesCount = e, this.positions = s.positions, this.velocities = s.velocities, this.sizes = s.sizes, this.masses = s.masses, this.decays = s.decays, this.lives = s.lives, this.gravities = s.gravities, this.aliveStatus = s.aliveStatus, this.colors = s.colors, this.physics = new P();
  }
  get data() {
    return {
      positions: this.positions,
      velocities: this.velocities,
      colors: this.colors,
      sizes: this.sizes,
      masses: this.masses,
      decays: this.decays,
      lives: this.lives,
      gravities: this.gravities,
      aliveStatus: this.aliveStatus
    };
  }
  getParticle(e) {
    const s = e * 3, a = e * 3, t = e * 3;
    return {
      x: this.positions[s],
      y: this.positions[s + 1],
      z: this.positions[s + 2],
      vx: this.velocities[a],
      vy: this.velocities[a + 1],
      vz: this.velocities[a + 2],
      mass: this.masses[e],
      alive: this.aliveStatus[e] === 1,
      size: this.sizes[e],
      r: this.colors[t],
      g: this.colors[t + 1],
      b: this.colors[t + 2],
      decay: this.decays[e],
      life: this.lives[e],
      gravity: this.gravities[e]
    };
  }
  update(e, s) {
    this.physics.update(e, s, this);
  }
  reset(e) {
    this.physics.reset(e, this);
  }
}
function b() {
  return typeof SharedArrayBuffer < "u" && self.crossOriginIsolated;
}
self.onmessage = function(v) {
  const {
    frameDelta: i,
    particlesCount: e,
    positions: s,
    velocities: a,
    sizes: t,
    masses: u,
    decays: d,
    lives: y,
    gravities: n,
    aliveStatus: o,
    colors: h
  } = v.data, c = new A(e, {
    positions: s,
    velocities: a,
    sizes: t,
    masses: u,
    decays: d,
    lives: y,
    gravities: n,
    aliveStatus: o,
    colors: h
  });
  for (let f = 0; f < e; f++)
    c.aliveStatus[f] === 1 && c.update(i, f);
  const r = {
    positions: c.positions,
    sizes: c.sizes,
    velocities: c.velocities,
    masses: c.masses,
    decays: c.decays,
    lives: c.lives,
    gravities: c.gravities,
    aliveStatus: c.aliveStatus
  }, m = b() && s.buffer instanceof SharedArrayBuffer ? [] : [
    r.positions.buffer,
    r.sizes.buffer,
    r.velocities.buffer,
    r.masses.buffer,
    r.decays.buffer,
    r.lives.buffer,
    r.gravities.buffer,
    r.aliveStatus.buffer
  ];
  self.postMessage(r, { transfer: m });
};
