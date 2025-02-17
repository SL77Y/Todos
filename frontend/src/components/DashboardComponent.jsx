import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const DashboardComponent = ({ tasks }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (tasks?.length > 0) {
      createDashboard(tasks);
    }
  }, [tasks]);

  const createDashboard = (tasks) => {
    const svgWidth = 1000;
    const svgHeight = 1000;

    // Clear previous SVG if exists
    d3.select(chartRef.current).select("svg").remove();

    // Create SVG
    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);

    // Task Priority Distribution
    const priorityData = d3.rollup(
      tasks,
      (v) => v.length,
      (d) => d.priority
    );

    const priorityColors = d3.schemeCategory10;

    const priorityChartGroup = svg
      .append("g")
      .attr("transform", "translate(0,50)");

    createPieChart(
      priorityData,
      priorityColors,
      priorityChartGroup,
      "Priority"
    );

    // Progress Distribution
    const progressData = d3.rollup(
      tasks,
      (v) => v.length,
      (d) => Math.floor(d.progress / 20) * 20
    );

    const progressColors = d3.schemeSet2;

    const progressChartGroup = svg
      .append("g")
      .attr("transform", "translate(500,50)");

    createPieChart(
      progressData,
      progressColors,
      progressChartGroup,
      "Progress"
    );

    // Task Completion Bar Chart
    const completionData = [
      { label: "Completed", count: tasks.filter((t) => t.completed).length },
      { label: "Incomplete", count: tasks.filter((t) => !t.completed).length },
    ];

    const barChartGroup = svg.append("g").attr("transform", "translate(0,550)");

    createBarChart(completionData, barChartGroup, "Completion");
  };

  const createPieChart = (data, colors, group, title) => {
    data = Array.from(data.entries());
    const radius = 200;

    const pie = d3.pie().value(([_, count]) => count);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const colorScale = d3.scaleOrdinal(colors);

    const pieGroup = group
      .append("g")
      .attr("transform", `translate(${radius},${radius})`);

    pieGroup
      .selectAll("path")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => {
        return colorScale(d.data[0]); // Automatically assign colors
      })
      .attr("stroke", "#fff") // Optional: Add stroke for better visibility
      .attr("stroke-width", 1);

    pieGroup
      .selectAll("text")
      .data(pie(data))
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", "10px")
      .text((d) => {
        switch (d.data[0]) {
          case "1":
            return "Low: " + d.data[1] + " Tasks";
          case "2":
            return "Medium: " + d.data[1] + " Tasks";
          case "3":
            return "High: " + d.data[1] + " Tasks";
          default:
            return `${d.data[1]} Tasks Completed: ${d.data[0]}%`;
        }
      });

    group
      .append("text")
      .attr("x", radius)
      .attr("y", radius * 2 + 20)
      .style("text-anchor", "middle")
      .text(`${title} Distribution`);
  };

  const createBarChart = (data, group, title) => {
    const barWidth = 800;
    const barHeight = 350;
    const barPadding = 5;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };

    // Update width and height to include margins
    const width = barWidth + margin.left + margin.right;
    const height = barHeight + margin.top + margin.bottom;

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, barWidth])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)])
      .range([barHeight, 0]);

    // Append a group to handle the chart with margins
    const chartGroup = group
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Add bars
    chartGroup
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.label))
      .attr("y", (d) => yScale(d.count))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => barHeight - yScale(d.count))
      .attr("fill", d3.scaleOrdinal(d3.schemePaired));

    // Add value labels above bars
    chartGroup
      .selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => xScale(d.label) + xScale.bandwidth() / 2)
      .attr("y", (d) => yScale(d.count) - 5)
      .style("text-anchor", "middle")
      .style("font-size", "10px")
      .text((d) => d.count);

    // Add X axis
    chartGroup
      .append("g")
      .attr("transform", `translate(0, ${barHeight})`) // Move X axis to the bottom
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)") // Rotate labels for better visibility
      .style("text-anchor", "end")
      .style("font-size", "10px");

    // Add Y axis
    chartGroup.append("g").call(d3.axisLeft(yScale));

    // Add chart title
    group
      .append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .text(title);
  };

  return <div ref={chartRef}></div>;
};

export default DashboardComponent;
