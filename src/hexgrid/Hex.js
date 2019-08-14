export class Hex {
  constructor (q = 0, r = 0) {
    this.v = [q, r, -q - r]
  }

  get q () {
    return this.v[0]
  }

  get r () {
    return this.v[1]
  }

  get s () {
    return -this.q - this.r
  }

  get length () {
    return Math.round(
      (Math.abs(this.q) + Math.abs(this.r) + Math.abs(this.s)) / 2
    )
  }

  neighbor (dir) {
    return Hex.add(this, DIRECTIONS[(6 + (dir % 6)) % 6])
  }

  clone () {
    return new Hex(this.q, this.r)
  }

  round () {
    const v = this.v.map(v => Math.round(v))
    const diff = v.map((v, i) => Math.abs(v - this.v[i]))
    if (diff[0] > diff[1] && diff[0] > diff[2]) {
      v[0] = -v[1] - v[2]
    } else if (diff[1] > diff[2]) {
      v[1] = -v[0] - v[2]
    }
    return new Hex(...v)
  }

  static equals (a, b) {
    return a.q === b.q && a.r === b.r && a.s === b.s
  }

  static add (a, b) {
    return new Hex(a.q + b.q, a.r + b.r)
  }

  static subtract (a, b) {
    return new Hex(a.q - b.q, a.r - b.r)
  }

  static multiply (a, b) {
    return new Hex(a.q * b.q, a.r * b.r)
  }

  static lerp (a, b, t) {
    return new Hex(lerp(a.q, b.q, t), lerp(a.r, b.r, t))
  }

  static distance (a, b) {
    return Hex.subtract(a, b).length
  }

  static lineDraw (a, b) {
    const n = Hex.distance(a, b)
    const aNudge = new Hex(a.q + 1e-6, a.r + 1e-6)
    const bNudge = new Hex(b.q + 1e-6, b.r + 1e-6)
    const results = []
    const step = 1 / Math.max(n, 1)
    for (let i = 0; i <= n; i++) {
      results.push(Hex.lerp(aNudge, bNudge, step * i).round())
    }
  }
}

function lerp (a, b, t) {
  return a * (1 - t) + b * t
}

export const DIRECTIONS = [
  new Hex(1, 0),
  new Hex(1, -1),
  new Hex(0, -1),
  new Hex(-1, 0),
  new Hex(-1, 1),
  new Hex(0, 1)
]
