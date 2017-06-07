//@flow
import React, {Component} from 'react'
import Two from 'two.js'
import Svg from './Svg'
import {clusterPkgsFromNodes} from '../utils/clustering'
import nodes from '../data/nodes4.json'

// const Chart = ({children}) => (
//   <div>
//     Chart
//     <div>{children}</div>
//   </div>
// )



class Chart extends Component{
  el: HTMLElement
  two: any

  onRef = (el:HTMLElement) => {
    this.el = el
    const two = new Two({
      autostart: true,
      type: Two.Types.webgl,
    })
    this.two = two
    var rect = two.makeRectangle(two.width / 2, two.height / 2, 50 ,50);


    const device = two.interpret(el.parentElement.querySelector('.svg-device svg')).center()
    const network = two.interpret(el.parentElement.querySelector('.svg-network svg')).center()
    const data = two.interpret(el.parentElement.querySelector('.svg-data svg')).center()
    //console.log(svg)

    for(let i=0; i<1000; i++) {
      const g1 = device.clone()
      g1.fill = 'green'
      g1.opacity= 1;
      g1.translation.set(two.width / 2, i)
      g1.scale = 2

      const g2 = network.clone()
      g2.fill = 'yellow'
      g2.opacity= 1;
      g2.translation.set(i, two.height / 2)
      g2.scale = 2

      const g3 = data.clone()
      g3.fill = 'red'
      g3.opacity= 1;
      g3.translation.set(two.width / 2 + i, two.height / 2 + i)
      g3.scale = 2
    }



    const clusters = clusterPkgsFromNodes(nodes)

    console.log(clusters)

    // clusters.items.forEach(c => {
    //   const r = two.makeRectangle(
    //     0,
    //     0,
    //     c.width,
    //     c.height)
    //
    //   console.log(c.x, c.y)
    //
    //   r.translation.set(c.x, c.y)
    //   r.fill = 'blue'
    //   r.stroke = 'red'
    //   //r.scale = 0.5
    // })
    // two.bind('update', function() {
    //   rect.rotation += 0.021;
    //   //g.rotation += 0.021;
    // });

    two.update()

    //two.scale = 4
    two.appendTo(el)
  }

  render(){
    return (<div>
      <div style={{position: 'absolute'}}>
        <Svg className="svg-data" name="map/data"/>
        <Svg className="svg-network" name="map/network"/>
        <Svg className="svg-device" name="map/device"/>
      </div>
      <div style={{border: 'solid 1px red', width: 1000, height: 1000}} ref={this.onRef}></div></div>)
  }
}

export default Chart
