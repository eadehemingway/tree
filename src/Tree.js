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
    const svg = d3
      .select('svg')
      .attr('width', svgWidth)
      .attr('height', svgHeight)
  }
  function updateTree() {
    const svg = d3.select('svg')
    const treemap = d3.tree().size([500, svgHeight])
    const nodes = treemap(d3.hierarchy(data, (d) => d.children))
    const link = svg.selectAll('.link').data(nodes.descendants().slice(1)) // this cuts off the first node cos that doesnt have links going to it

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

    //   ---------------------------------------------------------------------
    const nodeSelection = svg.selectAll('.node').data(nodes.descendants())

    const enteringNodeGroups = nodeSelection
      .enter()
      .append('g')
      .attr(
        'transform',
        (d) => 'translate(' + (nodes.y + padding) + ',' + nodes.x + ')'
      )

    const updateNodeSelection = enteringNodeGroups.merge(nodeSelection)

    enteringNodeGroups
      .append('circle')
      .attr('r', 10)
      .style('stroke', 'red')
      .style('fill', 'white')

    enteringNodeGroups
      .append('text')
      .attr('dy', '.35em')
      .attr('x', 20)
      .text((d) => d.data.name)
      .attr('font-family', 'futura')
      .attr('fill', 'lightslategray')

    enteringNodeGroups
      .transition()
      .duration(1000)
      .attr(
        'transform',
        (d) => 'translate(' + (d.y + padding) + ',' + d.x + ')'
      )
  }

  return (
    <section className="page-excl-nav">
      <h1 className="graph-title"> Tree </h1>
      <svg></svg>
    </section>
  )
}
