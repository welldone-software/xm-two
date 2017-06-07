import pack from 'bin-pack'


export const nodeHeight = 3 * 3
export const nodeWidth = 1 * 3
export const nodeWidthPadding = 3 * nodeWidth
export const nodeHeightPadding = 1 * nodeHeight
export const nodeBoxWidth = nodeWidth + (2 * nodeWidthPadding)
export const nodeBoxHeight = nodeHeight + (2 * nodeHeightPadding)
export const clusterWidthPadding = 5 * nodeWidthPadding
export const clusterHeightPadding = 5 * nodeHeightPadding


export const clusterPkgsFromNodes = nodes => {

  const clusters = nodes.reduce((all, node) => {
    const clusterName = node.cluster || 'unidentified'
    const {nodes} = all[clusterName] = all[clusterName] || { name: clusterName, nodes: [] }

    nodes.push({ ...node, width: nodeBoxWidth, height: nodeBoxHeight })
    nodes.push({ ...node, width: nodeBoxWidth, height: nodeBoxHeight })

    //all[clusterName + 'xx'] = all[clusterName + 'xx'] || { name: clusterName + 'xx', nodes: [] }
    // all[clusterName + 'xx'].nodes.push({ ...node, width: nodeBoxWidth, height: nodeBoxHeight })
    // all[clusterName + 'xx'].nodes.push({ ...node, width: nodeBoxWidth, height: nodeBoxHeight })
    // all[clusterName + 'xx'].nodes.push({ ...node, width: nodeBoxWidth, height: nodeBoxHeight })
    // all[clusterName + 'xx'].nodes.push({ ...node, width: nodeBoxWidth, height: nodeBoxHeight })
    return all
  }, {})

  Object.keys(clusters).forEach(clusterName => {
    const cluster = clusters[clusterName]
    const pkg = pack(cluster.nodes) //todo: use simplified pack such as shelf-pack or manual since it is trivial, nodes are same size
    cluster.width = pkg.width + (2 * clusterWidthPadding)
    cluster.height = pkg.height + (2 * clusterHeightPadding)
    pkg.items.forEach(({ x, y }, i) => {
      cluster.nodes[i].x = x + nodeWidthPadding
      cluster.nodes[i].y = y + nodeHeightPadding
    })
  })

  const clustersPkg = pack(Object.values(clusters))

  return clustersPkg;
}
