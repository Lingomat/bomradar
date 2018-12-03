![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

## BOM Radar

This is weather radar viewer based on the data from the Australian Bureau of Meteorology.

It was motivated by wanting to build the BOM radar into small dedicated displays, e.g. as Raspberry Pi and a little LCD, without all of the extraneous cruft of the BOM website radar viewer. It is not intended to be used on public web sites. I don't work for the BOM. 

The web component may be integrated into any web view regardless of JavaScript frameworks. Unlike the BOM's 1990s-tech viewer, it does not rely on refreshing and a server side scripts to provide a list of frames. It calculates when the next frame will be available and fetches continuously. It supports loops of a longer length than the BOM viewer. A Canvas is used to render the animated images and the component supports resizing.

## Using this component

### Script tag

- Put a script tag similar to this `<script src='dist/bomradar.js'></script>` in the head of your index.html
- Then you can use the element <bomradar-component> anywhere in your template, JSX, html etc

### Attributes

- width = width of radar image in px (native is 512 x 512, only use this to scale if necessary)
- height = as above
- product = product id for the particular weather radar
- imagecount = number of images to loop
- disable-copyright = boolean flag, removes strap at the top. 
- disable-text = boolean flag, removes time/location text at bottom (you will also lose some radar data)

```
<bomradar-component width="480" height="480" product="IDR632" imagecount="15" disable-text></bomradar-component>
```

Product is the only thing you really need to specify. Unless you want a radar of Darwin. To get product id, find the radar web page such as http://www.bom.gov.au/products/IDR632.loop.shtml
The URL shows the id, here 'IDR632'.

The component will try and load as many images as specified in imagecount attribute, but usually the BOM only keeps ten. However if you set imagecount to be larger than 10, it will keep adding future images to the loop until it is of length imagecount.

### API

There is a small API for the component.

- setOverlays(string[])
- stop()
- play()
- setFPS(number) for animation FPS, default = 5
- setPauseTime(number) for pause after each loop in seconds, default = 1

By default, bomradar displays the background and locations overlays. However you can also specify any of 'background', 'locations', 'waterways', 'topography' with setOverlays by passing an array of overlay names.

The stop() function stops the animation and stops fetching additional frames. This is useful for devices going into sleep mode etc.

The play() function re-starts the compnent, re-initializing the radar images and re-starting the animation. Returns a promise which resolves when the component has initialized.

The following is an example of using the web component API.

```
let bomradar = document.querySelector('bomradar-component')
bomradar.componentOnReady().then(() => {
  bomradar.setOverlays(['background', 'locations'])
  bomradar.setFPS(5)
})
```

### Demo

Just clone it, npm i, npm start. bish bash bosh.

### To-Do

- Tidy up and publish to NPM for easy distribution
- Add the observations overlay (this changes over time)

### Future

- Do optical flow analysis and then morph between frames - lol, right.

Seriously, something basic to indicate impending rain would be nice, since that's what we use the radar for anyway.

### Changes

0.1.1: Added switches for disabling the copyright and text straps. Added API. Added play/stop functionality and setting animation times and inter loop pause times.

### Shoutz

Darwin Hackerspace aaaaaaaiiiiiiiiggggggghhht!
http://darwinhackerspace.net/
