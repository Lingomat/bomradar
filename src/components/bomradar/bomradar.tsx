import { Component, Prop, State, Method } from '@stencil/core';
import { BOMData } from "./bomdata"

@Component({
  tag: 'bomradar-component',
  styleUrl: 'bomradar.css',
  shadow: true
})
export class BOMRadar {
  @Prop() width: number = 512
  @Prop() height: number = 512
  @Prop() product: string = 'IDR634'
  @Prop() imagecount: string = '10'
  @Prop() disableCopyright: boolean = false
  @Prop() disableText: boolean = false
  @State() overlays: string[] = ['background', 'locations'] // 'range' is another default

  radarImage: HTMLCanvasElement
  canvasContext: CanvasRenderingContext2D
  imagelag: number = 2
  numberofimages = 10
  radarimages: {image: HTMLImageElement, loaded: boolean}[] = []
  bomdata = new BOMData()
  validOverlays: string[] = ['background', 'locations', 'waterways', 'topography']
  stopped: boolean = false
  framesPerSecond: number = 5
  interLoopPause: number = 1

  async componentDidLoad() {
    this.canvasContext = this.radarImage.getContext("2d")
    this.radarImage.width = 512
    this.radarImage.height = 512
    this.init()
  }

  async init() {
    let ic = parseInt(this.imagecount)
    try {
      await this.bomdata.init(this.product, (ic === NaN) ? 10 : ic)
    } catch (e) {
      console.error(e)
      return 
    }
    this.startAnimation()
  }

  waitSeconds(sec: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, sec * 1000)
    })
  }

  startAnimation() {
    setTimeout(() => {
      this.doAnimation()
    }, this.interLoopPause * 1000 )
  }

  async doAnimation() {
    let images = this.bomdata.getImages()
    for (let image of images) {
      this.canvasContext.clearRect(0, 0, 512, 512)
      let ystart: number = this.disableCopyright ? 16 : 0
      let yfinish: number = 512 - ystart - (this.disableText ? 16 : 0)
      this.canvasContext.drawImage(image.i, 0, ystart, 512, yfinish, 0, ystart, 512, yfinish)
      await this.waitSeconds(1/this.framesPerSecond)
    }
    await this.bomdata.update()
    if (!this.stopped) {
      setTimeout(() => {
        this.doAnimation()
      }, this.interLoopPause * 1000 )
    }
  }

  getOverlayBackground(o: string) {
    return "url('" + "http://ws.cdn.bom.gov.au/products/radar_transparencies/" + this.product + "." + o + ".png"
  }

  getDimensions() {
    return {
      width: this.width.toString() + 'px',
      height: this.height.toString() + 'px'
    }
  }

  @Method()
  setOverlays(ovl: string[]) {
    if (!Array.isArray(ovl)) {
      throw new Error("setOverlay() requires an array of overlay names.")
    }
    for (let o of ovl) {
      if (!this.validOverlays.includes(o)) {
        throw new Error("Invalid overlay name "+o)
      }
    }
    this.overlays = ovl
  }

  @Method()
  stop() {
    this.stopped = true
  }

  @Method()
  async play() {
    if (this.stopped) {
      let ic = parseInt(this.imagecount)
      await this.bomdata.init(this.product, (ic === NaN) ? 10 : ic)
      this.stopped = false
      this.startAnimation()
    }
  }

  @Method()
  setFPS(fps: number) {
    if (typeof fps !== "number") {
      throw new Error("setFPS() requires an integer.")
    }
    this.framesPerSecond = fps
  }

  @Method()
  setPauseTime(t: number) {
    if (typeof t !== "number") {
      throw new Error("setPauseTime() requires an integer.")
    }
    this.interLoopPause = t
  }

  render() {
    return <div id="bomradar" style={this.getDimensions()}>
      {this.overlays.map((overlay) =>
        <div class="overlay" style={{backgroundImage: this.getOverlayBackground(overlay)}}>
        </div>
      )}
      <canvas id="radardata" ref={(el) => this.radarImage = el as HTMLCanvasElement}></canvas>
    </div>
  }
}
