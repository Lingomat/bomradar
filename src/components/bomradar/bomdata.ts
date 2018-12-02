import { subMinutes } from 'date-fns'

export class BOMData {
  product: string = null
  lastUpdateDate: Date
  images: {i: HTMLImageElement, d: Date}[] = []
  howmany: number = null
  lastminute: number = null

  fetchImage(urls: string): Promise<HTMLImageElement> {
    let image = new Image()
    image.src = urls
    return new Promise((resolve, reject) => {
      image.onload = () => {
        resolve(image)
      }
      image.onerror = () => {
        reject()
      }
    })
  }

  makeFilenameFromDate(dt: Date): string {
    const pad = (n: string) => {
      return ('0' + n).slice(-2)
    }
    const getUTCstring = (dt: Date) => {
      return dt.getUTCFullYear().toString() + 
      pad((dt.getUTCMonth() + 1).toString()) + 
      pad(dt.getUTCDate().toString()) + 
      pad(dt.getUTCHours().toString()) + 
      pad(dt.getUTCMinutes().toString())
    }
    return 'http://www.bom.gov.au/radar/' + this.product + '.T.' + getUTCstring(dt) + '.png'
  }
  getLastImageDate(imagelag: number = 3) {
    let now = new Date()
    let minutes = now.getUTCMinutes()
    let remainer = minutes % 6
    let subMin = (remainer >= imagelag) ? remainer : (6 + remainer)
    return subMinutes(now, subMin)
  }
  async init(product: string, howmany: number = 10) {
    this.product = product
    this.howmany = howmany
    let trydate = this.getLastImageDate()
    this.lastminute = (new Date()).getUTCMinutes()
    // let's get the first valid result in the past
    let success: boolean = false
    let retries: number = 10
    let firstimage: HTMLImageElement = null
    for (let x = 0; x < retries; ++x) {
      let fn = this.makeFilenameFromDate(trydate)
      try {
        firstimage = await this.fetchImage(fn)
        success = true
        break
      } catch(e) {
        console.log('fetch error', e)
        trydate = subMinutes(trydate, 6)
      }
    }
    if (!success) {
      throw new Error("Could not fetch a valid image after " + retries.toString() + " retries!")
    }
    this.lastUpdateDate = trydate
    // now let's get the older images
    // let proms: Promise<{d: Date, i: HTMLImageElement}>[] = []
    // for (let x = this.howmany - 1; x > 0 ; --x) {  
    //   console.log('x', x, 6 * x)
    //   let ld = subMinutes(trydate, 6 * x)
    //   proms.push(new Promise((resolve) => {
    //     let fn = this.makeFilenameFromDate(ld)
    //     this.fetchImage(fn)
    //     .then((img) => {
    //       resolve({d: ld, i: img})
    //     })
    //   }))
    // }
    //let res = await Promise.all(proms)
    let hm: number = 1
    let imgs: {d: Date, i: HTMLImageElement}[] = []
    for (let x = 1; x < this.howmany -1; ++x) {
      let ld = subMinutes(trydate, 6 * x)
      let fn = this.makeFilenameFromDate(ld)
      let img: HTMLImageElement
      try {
        img = await this.fetchImage(fn)
        ++hm
        imgs.push({d: ld, i: img})
      } catch {
        break
      }
    }
    if (hm < this.howmany) {
      console.log('we only have ', hm) // it seems this ends up being 10
    }
    imgs.reverse()
    this.images = [...imgs, {d: trydate, i: firstimage}]
    //this.images = [...res, {d: trydate, i: firstimage}]
  }
  getImages(): {i: HTMLImageElement, d: Date}[] {
    return this.images
  }
  getImage(pos: number): {d: Date, i: HTMLImageElement} {
    return this.images[pos]
  }
  async update(): Promise<any> {
    let thismin: number = (new Date()).getUTCMinutes()
    // don't check unless on the minute
    if (thismin == this.lastminute) {
      return
    }
    this.lastminute = thismin
    // get speculative last date
    let speculativeDate = this.getLastImageDate()
    if (speculativeDate.getMinutes() === this.lastUpdateDate.getMinutes()) {
      return // if it's the same, don't do anything
    }
    // looks like we have a new candidate so let's try get it
    let fn = this.makeFilenameFromDate(speculativeDate)
    let img: HTMLImageElement
    try {
      img = await this.fetchImage(fn)
    } catch {
      console.log('no image yet')
      return // will not try this again until the next minute
    }
    console.log('got a new image!')
    this.lastUpdateDate = speculativeDate
    // we collect as many images as the specified limit, trashing them after that
    if (this.images.length === this.howmany) {
      this.images.shift()
    }
    this.images.push({i: img, d: speculativeDate})
  }

}
