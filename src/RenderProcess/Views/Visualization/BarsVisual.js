
import * as d3 from 'd3';

var audioCtx;
var audioSrc;
var analyser;
var lastFormatType;

export function makeBars(tagType) {
    if (audioCtx == undefined) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    let audioElement = document.getElementsByTagName(tagType);

    if (audioSrc == undefined || lastFormatType != tagType)
        audioSrc = audioCtx.createMediaElementSource(audioElement[0]);
    if (analyser == undefined || lastFormatType != tagType)
        analyser = audioCtx.createAnalyser();

    lastFormatType = tagType;

    audioSrc.connect(analyser);
    audioSrc.connect(audioCtx.destination);

    var frequencyData = new Uint8Array(50);

    let visBox = document.getElementById('VisualBox');
    var svgHeight = visBox.clientHeight;
    var svgWidth = visBox.clientWidth;
    var barPadding = '1';

    function createSvg(parent, height, width) {
        return d3.select(parent).append('svg').attr('height', height).attr('width', width);
    }

    var svg = createSvg('#VisualBox', svgHeight, svgWidth);

    d3.select(window).on('resize', () => {
        let visBox = document.getElementById('VisualBox');
        svgHeight = visBox.clientHeight;
        svgWidth = visBox.clientWidth;
        d3.select('svg').attr('height', svgHeight).attr('width', svgWidth);
        d3.selectAll('rect')
            .attr('width', svgWidth / frequencyData.length - barPadding)
            .attr('x', function (d, i) {
                return i * (svgWidth / frequencyData.length);
            });
    })

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
                return ((d / 255) * svgHeight);
            })
            .attr('height', function (d) {
                return svgHeight - ((d / 255) * svgHeight);
            })
            .attr('fill', function (d) {
                return 'rgb(0, 0, ' + d + ')';
            });
    }

    // Run the loop
    renderChart();
}