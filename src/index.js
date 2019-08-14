import OpenSimplexNoise from 'open-simplex-noise'
import { Viewport } from 'pixi-viewport'
import * as PIXI from 'pixi.js'
import { Hex } from './hexgrid/Hex'
import { HexMap } from './hexgrid/HexMap'
import { Layout, Orientation } from './hexgrid/Layout'

const app = new PIXI.Application({ width: 100, height: 100, resizeTo: window })
document.body.appendChild(app.view)

app.renderer.autoResize = true
app.renderer.resize(512, 512)

app.renderer.view.style.position = 'absolute'
app.renderer.view.style.display = 'block'
app.renderer.autoResize = true
app.renderer.resize(window.innerWidth, window.innerHeight)

const viewport = new Viewport({
  screenWidth: window.innerWidth,
  screenHeight: window.innerHeight,
  worldWidth: 60000,
  worldHeight: 60000,
  antiAlias: true,
  interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
})

viewport
  .drag()
  .pinch()
  .wheel()
  .decelerate()

app.stage.addChild(viewport)

const layout = new Layout(
  Orientation.flat,
  new PIXI.Point(150, 150),
  new PIXI.Point(0, 0)
)

const map = HexMap.hexagon(100)
const mapCont = new PIXI.Container()
mapCont.x = mapCont.y = 30000
viewport.addChild(mapCont)

console.log(map.length)

const poly = layout.polygonCorners(new Hex())
console.log(poly)

const textures = {}
const types = [['plain', 0x555555], ['wall', 0x222222], ['swamp', 0x00cc00]]
for (const [type, color] of types) {
  const hex = new PIXI.Graphics()
  // hex.lineStyle(1, 0xbbbbbb)
  hex.beginFill(color)
  hex.drawPolygon(poly)
  hex.endFill()
  textures[type] = app.renderer.generateTexture(
    hex,
    PIXI.SCALE_MODES.NEAREST,
    10,
    new PIXI.Rectangle(-200, -200, 400, 400)
  )
}
const noise = new OpenSimplexNoise(Date.now())
const noise2 = new OpenSimplexNoise(Date.now() + 10)

const wscale = 1 / 1000
const sscale = 5 / 10000

for (const h of map) {
  const pos = layout.hexToPixel(h)
  const n = (noise.noise2D(pos.x * wscale, pos.y * wscale) + 1) / 2
  const n2 = (noise2.noise2D(pos.x * sscale, pos.y * sscale) + 1) / 2
  const type = n < 0.5 ? 'wall' : n2 > 0.7 ? 'swamp' : 'plain'
  const texture = textures[type]
  const hex = PIXI.Sprite.from(texture)
  hex.position = pos
  mapCont.addChild(hex)
}

viewport.fitWorld()
