import * as PIXI from 'pixi.js'
import { Hex } from './Hex'

export class Orientation {
  constructor (f0, f1, f2, f3, b0, b1, b2, b3, startAngle) {
    Object.assign(this, { f0, f1, f2, f3, b0, b1, b2, b3, startAngle })
  }
}

const sqrt3 = Math.sqrt(3)

Orientation.pointy = new Orientation(
  sqrt3,
  sqrt3 / 2,
  0,
  3 / 2,
  sqrt3 / 3,
  -1 / 3,
  0,
  2 / 3,
  0.5
)

Orientation.flat = new Orientation(
  3 / 2,
  0,
  sqrt3 / 2,
  sqrt3,
  2 / 3,
  0,
  -1 / 3,
  sqrt3 / 3,
  0
)

export class Layout {
  constructor (orientation, size, origin) {
    this.orientation = orientation
    this.size = size
    this.origin = origin
  }

  pixelToHex (p) {
    const o = this.orientation
    const x = (p.x - this.origin.x) / this.size.x
    const y = (p.y - this.origin.y) / this.size.y
    const q = o.b0 * x + o.b1 * y
    const r = o.b2 * x + o.b3 * y
    return new Hex(q, r)
  }

  hexToPixel (h) {
    const o = this.orientation
    const x = (o.f0 * h.q + o.f1 * h.r) * this.size.x
    const y = (o.f2 * h.q + o.f3 * h.r) * this.size.y
    return new PIXI.Point(x + this.origin.x, y + this.origin.y)
  }

  hexCornerOffset (corner) {
    const angle = (2 * Math.PI * (this.orientation.startAngle + corner)) / 6
    return new PIXI.Point(
      this.size.x * Math.cos(angle),
      this.size.y * Math.sin(angle)
    )
  }

  polygonCorners (h) {
    const corners = []
    const center = this.hexToPixel(h)
    for (let i = 0; i < 6; i++) {
      const offset = this.hexCornerOffset(i)
      corners.push(new PIXI.Point(center.x + offset.x, center.y + offset.y))
    }
    return corners
  }
}
