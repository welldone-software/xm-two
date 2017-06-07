import React from 'react'


declare var require: {context: Function}

const reqIcons = require.context('../assets/', true, /\.svg$/)

console.log(reqIcons.keys())

const Svg = ({name, className, style}) => {
  const svg = reqIcons(`./${name}.svg`)
  return <div dangerouslySetInnerHTML={{__html: svg}} style={style} className={className}></div>
}

export default Svg
