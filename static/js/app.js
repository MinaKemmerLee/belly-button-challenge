// Function to initialize the dashboard
function init() {
    // Fetch data using d3.json()
    d3.json("/samples.json").then(data => {
      // Extract necessary data from 'data' object
      const samples = data.samples;
      const metadata = data.metadata;
  
      // Create dropdown options
      const dropdown = d3.select("#selDataset");
      samples.forEach(sample => {
        dropdown.append("option").text(sample.id).property("value", sample.id);
      });
  
      // Default sample to display
      const defaultSample = samples[0];
  
      // Call functions to update visualizations and metadata
      updateBarChart(defaultSample);
      updateBubbleChart(defaultSample);
      updateMetadata(defaultSample);
    });
  }
  
  // Function to update the bar chart
  function updateBarChart(sample) {
    // Extract data for the bar chart
    const sampleValues = sample.sample_values.slice(0, 10);
    const otuIds = sample.otu_ids.slice(0, 10);
    const otuLabels = sample.otu_labels.slice(0, 10);
  
    // Create bar chart using Plotly
    const barData = [
        {
          x: sampleValues,
          y: otuIds.map(id => `OTU ${id}`),
          text: otuLabels,
          type: "bar",
          orientation: "h"
        }
      ];
    
      const barLayout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" }
      };
    
      Plotly.newPlot("bar", barData, barLayout);
    
  }
  
  // Function to update the bubble chart
  function updateBubbleChart(sample) {
    // Extract data for the bubble chart
    const sampleValues = sample.sample_values;
    const otuIds = sample.otu_ids;
    const otuLabels = sample.otu_labels;
  
    // Create bubble chart using Plotly
    const bubbleData = [
    {
        x: sample.otu_ids,
        y: sample.sample_values,
        text: sample.otu_labels,
        mode: "markers",
        marker: {
          size: sample.sample_values,
          color: sample.otu_ids,
          colorscale: "Viridis"
        }
      }
    ];
  
    const bubbleLayout = {
      title: "OTU ID vs Sample Values",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };
  
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  }
  
// Function to update the metadata display
function updateMetadata(selectedSample) {
    // Fetch the metadata for the selected sample
    d3.json("/samples.json").then(data => {
      const metadata = data.metadata;
      console.log("All Metadata:", metadata);
      
      const selectedMetadata = metadata.find(entry => entry.id === parseInt(selectedSample));
      console.log("Selected Metadata:", selectedMetadata);
  
      const metadataDiv = d3.select("#sample-metadata");
      metadataDiv.html("");
  
      if (selectedMetadata) {
        const keysToShow = ["id", "ethnicity", "gender", "age", "location", "bbtype", "wfreq"];
        keysToShow.forEach(key => {
          metadataDiv.append("p").text(`${key}: ${selectedMetadata[key]}`);
        });
      } else {
        metadataDiv.text("No metadata available for this sample.");
      }
    });
  }
  
  // Function called when dropdown option changes
  function optionChanged(selectedSample) {
    d3.json("/samples.json").then(data => {
      const selectedSampleData = data.samples.find(sample => sample.id === selectedSample);
  
      updateBarChart(selectedSampleData);
      updateBubbleChart(selectedSampleData);
      updateMetadata(selectedSampleData.id);
    });
  }
  
  // Initialize the dashboard
  init();