import { Component, Prop } from '@stencil/core';
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

  //overlays: string[] = ['background', 'locations', 'range']
  overlays: string[] = ['background', 'locations']
  radarImage: HTMLCanvasElement
  canvasContext: CanvasRenderingContext2D
  // http://www.bom.gov.au/radar/IDR634.T.201811090430.png
  // "http://ws.cdn.bom.gov.au/products/radar_transparencies/"
  imagelag: number = 2
  numberofimages = 10
  radarimages: {image: HTMLImageElement, loaded: boolean}[] = []
  bomdata = new BOMData()
  displayCopyright: boolean = false
  displayText: boolean = true

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
    this.doAnimation2()
  }

  waitSeconds(sec: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, sec * 1000)
    })
  }

  async doAnimation() {
    let pos = 0
    while (true) {
      let thisImage = this.bomdata.getImage(pos)
      if (thisImage) {
        this.canvasContext.clearRect(0, 0, 512, 512)
        //this.canvasContext.drawImage(thisImage.i, 0, 16, 512, 480, 0, 16, 512, 480)
        let ystart: number = this.displayCopyright ? 0 : 16
        let yfinish: number = 512 - ystart - (this.displayText ? 0 : 16)

        this.canvasContext.drawImage(thisImage.i, 0, ystart, 512, yfinish, 0, ystart, 512, yfinish)
      }
      await this.waitSeconds(0.25)
      pos++
      if (pos == this.numberofimages) {
        pos = 0
        await this.waitSeconds(1)
        await this.bomdata.update()
      }
    }
  }

  async doAnimation2() {
    while (true) {
      let images = this.bomdata.getImages()
      for (let image of images) {
        this.canvasContext.clearRect(0, 0, 512, 512)
        let ystart: number = this.displayCopyright ? 0 : 16
        let yfinish: number = 512 - ystart - (this.displayText ? 0 : 16)
        this.canvasContext.drawImage(image.i, 0, ystart, 512, yfinish, 0, ystart, 512, yfinish)
        await this.waitSeconds(0.25)
      }
      await this.waitSeconds(1)
      await this.bomdata.update()
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

  render() {
    //return <div>Hello, World! I'm {this.format()}</div>;
    return <div id="bomradar" style={this.getDimensions()}>
      {this.overlays.map((overlay) =>
        <div class="overlay" style={{backgroundImage: this.getOverlayBackground(overlay)}}>
        </div>
      )}
      <canvas id="radardata" ref={(el) => this.radarImage = el as HTMLCanvasElement}></canvas>
    </div>
  }
}
