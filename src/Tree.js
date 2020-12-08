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

    // DRAW THE LINKS ===========================================================

    // select all links on page
    const linkSelection = svg
      .selectAll('.link')
      .data(nodes.descendants().slice(1)) // this cuts off the first node cos that doesnt have links going to it

    // enter links if needed
    const enteringLinks = linkSelection
      .enter()
      .append('path')
      .attr('class', 'link')
      .style('stroke', 'lightsteelblue')
      .style('stroke-width', '2px')
      .attr('fill', 'none')

    // create update link selection i.e. all entering links and all existing links
    const updatedLinkSelection = linkSelection.merge(enteringLinks)

    // translate all links
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

    // make unneeded links exit.
    linkSelection.exit().remove()

    // DRAW THE NODES ===========================================================

    // select all node groups on the page
    const nodeSelection = svg
      .selectAll('.node-groups')
      .data(nodes.descendants(), (d) => d.data.name)

    // for each one create a group
    const enteringNodeGroups = nodeSelection
      .enter()
      .append('g')
      .attr('class', 'node-groups')

    // in each group create a circle
    enteringNodeGroups
      .append('circle')
      .attr('class', 'nodes-circles')
      .attr('r', 10)
      .style('stroke', 'red')
      .style('fill', 'white')

    // in each group create a text node
    enteringNodeGroups
      .append('text')
      .attr('dy', '.35em')
      .attr('x', 20)
      .attr('font-family', 'futura')
      .attr('fill', 'lightslategray')

    // create an update selection i.e. combination of entering nodes and existing nodes
    const updateNodeSelection = enteringNodeGroups.merge(nodeSelection)

    // translate all nodes
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

    // select all text nodes and update text
    updateNodeSelection.selectAll('text').text((d) => d.data.name)

    // make unneeded nodes exit.
    nodeSelection.exit().remove()
  }

  return (
    <section className="page-excl-nav">
      <svg></svg>
    </section>
  )
}
