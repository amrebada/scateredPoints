import React from "react";
import styled from "styled-components";
import { select, max } from "d3";
import "./styles.css";

const rd1 = () => Math.floor(Math.random() * 60);
const rd2 = () => Math.floor(Math.random() * 40);

const data = [...new Array(31)].map(() => ({
  roles: [...new Array(rd2())].map((_, i) => rd1()),
  users: [...new Array(rd2())].map((_, i) => rd1())
}));

const getMaxColumn = (all, i) => {
  return i < 0
    ? 0
    : Math.ceil(
        all[i].reduce((p, c) => {
          const maximum = c.length;
          if (p < maximum) return maximum;
          return p;
        }, 0) / 4
      ) + getMaxColumn(all, i - 1);
};

export default function App() {
  const gridRef = React.createRef();

  React.useEffect(() => {
    const chart = select(gridRef.current);
    const MaxValue = data.reduce((p, c) => {
      const maxR = max(c.roles);
      const maxU = max(c.users);
      if (p < maxR) return maxR;
      if (p < maxU) return maxU;
      return p;
    }, 0);
    const r = 7;
    const maxpoints = 4;
    const sectionHeight = 2 * maxpoints * r;
    const NumOfSections = Math.ceil(MaxValue / 10);
    const totalHeight = NumOfSections * sectionHeight;
    const Types = { roles: "roles", users: "users" };
    const sectionsDays = data.map((day, i) => {
      const sections = [...new Array(NumOfSections)].map(() => []);
      day.roles.forEach((r) => {
        const j = Math.floor(r / 10);
        sections[j] = [...sections[j], { type: Types.roles, value: r }];
      });
      day.users.forEach((u) => {
        const i = Math.floor(u / 10);
        sections[i] = [...sections[i], { type: Types.users, value: u }];
      });
      return sections.reverse();
    });
    //background
    chart
      .selectAll("path")
      .data(sectionsDays)
      .enter()
      .append("path")
      .attr("fill", (_, i) => (i % 2 === 0 ? "#ccc4" : "white"))
      .attr("stroke-width", 0)

      .attr("d", (d, i) => {
        const maxCount = getMaxColumn(sectionsDays, i - 1);
        const maxCountplusone = getMaxColumn(sectionsDays, i);

        return `M ${maxCount * 2 * r + 2 * r * i},0 L ${
          maxCount * 2 * r + 2 * r * i
        },${totalHeight + sectionHeight} L ${
          maxCountplusone * 2 * r + 2 * r * i
        },${totalHeight + sectionHeight} L ${
          maxCountplusone * 2 * r + 2 * r * i
        },0 z`;
      });
    //points group
    const days = chart
      .selectAll("g")
      .data(sectionsDays)
      .enter()
      .append("g")
      .style("fill", "blue")
      .attr("transform", (d, i) => {
        const maxCount = getMaxColumn(sectionsDays, i - 1);

        return `translate(${maxCount * 2 * r + 2 * r * i},0) `;
      });
    //legend
    chart
      .selectAll("text")
      .data(sectionsDays)
      .enter()
      .append("text")
      .style("fill", "blue")
      .text((_, i) => `${i}`)
      .attr("transform", (d, i) => {
        const maxCount = getMaxColumn(sectionsDays, i - 1);
        return `translate(${maxCount * 2 * r + 2 * r * i},${
          totalHeight + sectionHeight + 20
        }) `;
      });
    //separateLines
    chart
      .selectAll("path")
      .data(sectionsDays)
      .enter()
      .append("path")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .style("opacity", 0.15)
      .attr("d", (d, i) => {
        const maxCount = getMaxColumn(sectionsDays, i - 1);
        return `M ${maxCount * 2 * r + 2 * r * i},0 L ${
          maxCount * 2 * r + 2 * r * i
        },${totalHeight + sectionHeight}`;
      });

    const columns = days
      .selectAll("g")
      .data((d) => d)
      .enter()
      .append("g")
      .attr("transform", (_, i) => {
        return `translate(0,${sectionHeight * i + r * i}) `;
      });
    columns
      .selectAll("circle")
      .data((d) => d)
      .enter()
      .append("circle")

      .attr("cx", (d, i) => {
        const xc = Math.floor(i / maxpoints);
        const x = xc * 2 * r + 1.5 * r;
        return x;
      })
      .attr("cy", (d, i) => {
        const yc = 4 - (i % maxpoints);
        const y = yc * 2 * r + 1.5 * r;
        return y;
      })
      .attr("r", r / 2)
      .attr("fill", (d) => (d.type === Types.roles ? "#c94949" : "#181f40"));
    // columns
    //   .selectAll("text")
    //   .data((d) => d)
    //   .enter()
    //   .append("text")
    //   .attr("x", (d, i) => {
    //     const xc = Math.floor(i / maxpoints);
    //     const x = xc * 2 * r + 1.5 * r;
    //     return x;
    //   })
    //   .attr("y", (d, i) => {
    //     const yc = i % maxpoints;
    //     const y = yc * 2 * r + 1.5 * r;
    //     return y;
    //   })
    //   .text((d, i) => `${i}`)
    //   .attr("font-family", "sans-serif")
    //   .attr("font-size", "10px")
    //   .attr("fill", "orange");
  }, [gridRef]);
  return (
    <Container>
      <svg width="2500" height="500" ref={gridRef}></svg>
    </Container>
  );
}
const Container = styled.div`
  .rectClass {
    opacity: 0.5;
  }
`;
