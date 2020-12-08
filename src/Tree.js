import React, { useEffect } from 'react'
import * as d3 from 'd3'

export default function Tree({ data }) {
  const padding = 11
  const svgWidth = 700
  const svgHeight = 500
  useEffect(() => {
    doInitialStuff()
  }, [])
  useEffect(() => {
    updateTree()
  }, [data])

  function doInitialStuff() {
    // do the stuff you only want to do once, in this case its not much
    d3.select('svg').attr('width', svgWidth).attr('height', svgHeight)
  }
  function updateTree() {
    const svg = d3.select('svg')
    const treemap = d3.tree().size([500, svgHeight])
    const nodes = treemap(d3.hierarchy(data, (d) => d.children))
    const link = svg.selectAll('.link').data(nodes.descendants().slice(1)) // this cuts off the first node cos that doesnt have links going to it

    // DRAW THE LINKS ===========================================================
    const enteringLinks = link
      .enter()
      .append('path')
      .attr('class', 'link')
      .style('stroke', 'lightsteelblue')
      .style('stroke-width', '2px')
      .attr('fill', 'none')

    const updatedLinkSelection = link.merge(enteringLinks)

    updatedLinkSelection
      .attr('transform', (d) => 'translate(' + padding + ',0)')
      .attr('d', (d) => {
        return (
          'M' +
          nodes.y +
          ',' +
          nodes.x +
          'C' +
          nodes.y / 2 +
          ',' +
          d.x +
          ' ' +
          nodes.y / 2 +
          ',' +
          nodes.x +
          ' ' +
          nodes.y +
          ',' +
          nodes.x
        )
      })
      .transition()
      .duration(1000)
      .attr('d', (d) => {
        return (
          'M' +
          d.y +
          ',' +
          d.x +
          'C' +
          (d.y + d.parent.y) / 2 +
          ',' +
          d.x +
          ' ' +
          (d.y + d.parent.y) / 2 +
          ',' +
          d.parent.x +
          ' ' +
          d.parent.y +
          ',' +
          d.parent.x
        )
      })

    link.exit().remove()

    // DRAW THE NODES ===========================================================
    const nodeSelection = svg
      .selectAll('.node-groups')
      .data(nodes.descendants(), (d) => d.data.name)

    const enteringNodeGroups = nodeSelection
      .enter()
      .append('g')
      .attr('class', 'node-groups')

    enteringNodeGroups
      .append('circle')
      .attr('class', 'nodes-circles')
      .attr('r', 10)
      .style('stroke', 'red')
      .style('fill', 'white')

    enteringNodeGroups
      .append('text')
      .attr('dy', '.35em')
      .attr('x', 20)
      .attr('font-family', 'futura')
      .attr('fill', 'lightslategray')

    const updateNodeSelection = enteringNodeGroups.merge(nodeSelection)

    updateNodeSelection
      .attr(
        'transform',
        (d) => 'translate(' + (nodes.y + padding) + ',' + nodes.x + ')'
      )
      .transition()
      .duration(1000)
      .attr(
        'transform',
        (d) => 'translate(' + (d.y + padding) + ',' + d.x + ')'
      )

    updateNodeSelection.selectAll('text').text((d) => d.data.name)

    nodeSelection.exit().remove()
  }

  return (
    <section className="page-excl-nav">
      <svg></svg>
    </section>
  )
}
