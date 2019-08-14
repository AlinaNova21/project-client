import { Hex } from './Hex'

export class HexMap {
  static hexagon (radius) {
    const ret = []
    for (let q = -radius; q <= radius; q++) {
      const r1 = Math.max(-radius, -q - radius)
      const r2 = Math.min(radius, -q + radius)
      for (let r = r1; r <= r2; r++) {
        ret.push(new Hex(q, r))
      }
    }
    return ret
  }
}
