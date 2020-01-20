async function buildMetadata(sample) {

    const data = await d3.json("/metadata/"+sample);

    let panel = d3.select("#sample-metadata")

    panel.html("")
  
    
      Object.entries(data).forEach(thing => {
        panel.append("row").text(thing[0] + ": " + thing[1]);
        panel.append("br")
        panel.append("br")
      });
  
      buildGauge(data.WFREQ);
  };
  
  async function buildCharts(sample) {
  
      let dataFile = await d3.json("/samples/"+sample);
 
      const plotData = {
        x: dataFile.otu_ids,
        y: dataFile.sample_values,
        text: dataFile.otu_labels,
        mode: `markers`,
        marker: {
          size: dataFile.sample_values,
          color: dataFile.otu_ids
        }
      };
      data = [plotData];
      const layout = {
        xaxis: {title: "OTU ID"}
      };
      Plotly.newPlot("bubble", data, layout);
     
      const pieData = [{
        values: dataFile.sample_values.slice(0,10),
        labels: dataFile.otu_ids.slice(0,10),
        hovertext: dataFile.otu_labels.slice(0,10),
        type: "pie"
      }];
  
      Plotly.newPlot("pie", pieData);
      
  }
  
  function init() {

    var selector = d3.select("#selDataset");
  
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {

    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  init();