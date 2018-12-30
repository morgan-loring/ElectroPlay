
import * as d3 from 'd3';

export default function makeBox() {
    var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var audioElement = document.getElementById('AudioEle');
    var audioSrc = audioCtx.createMediaElementSource(audioElement);
    var analyser = audioCtx.createAnalyser();

    audioSrc.connect(analyser);
    audioSrc.connect(audioCtx.destination);


    var frequencyData = new Uint8Array(100);

    var svgHeight = '300';
    var svgWidth = '1200';
    var barPadding = '1';

    function createSvg(parent, height, width) {
        return d3.select(parent).append('svg').attr('height', height).attr('width', width);
    }

    var svg = createSvg('#VisualBox', svgHeight, svgWidth);

    svg.selectAll('rect')
        .data(frequencyData)
        .enter()
        .append('rect')
        .attr('x', function (d, i) {
            return i * (svgWidth / frequencyData.length);
        })
        .attr('width', svgWidth / frequencyData.length - barPadding);

    function renderChart() {
        requestAnimationFrame(renderChart);

        //copies song data to new array
        analyser.getByteFrequencyData(frequencyData);

        //update the bars
        svg.selectAll('rect')
            .data(frequencyData)
            .attr('y', function (d) {
                return svgHeight - d;
            })
            .attr('height', function (d) {
                return d;
            })
            .attr('fill', function (d) {
                return 'rgb(0, 0, ' + d + ')';
            });
    }

    // Run the loop
    renderChart();
}