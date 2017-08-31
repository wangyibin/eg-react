import SvgComponent from './SvgComponent';

const HEIGHT = 20;
const BOUNDARY_LINE_EXTENT = 5;
const LABEL_OFFSET = 80;

/**
 * Draws rectangles that represent chromosomes and their labels.
 * 
 * @author Silas Hsu
 * @extends SvgComponent
 */
class Chromosomes extends SvgComponent {
    /**
     * Clears this group and redraws all the chromosomes.
     * 
     * @override
     */
    render() {
        this.group.clear();

        let regionList = this.props.model.getRegionList();
        let x = 0;
        for (let region of regionList) {
            let width = this.basesToXWidth(region.end - region.start + 1);

            this.group.rect().attr({ // Rectangle for each chromosome
                width: width,
                height: HEIGHT,
                x: x,
                y: BOUNDARY_LINE_EXTENT,
                stroke: "#000",
                "stroke-width": 2,
                fill: "#fff"
            });

            if (x > 0) { // Thick line at boundaries of chromosomes (except the first one)
                let regionBoundaryLine = this.group.line(x, 0, x, BOUNDARY_LINE_EXTENT * 2 + HEIGHT);
                regionBoundaryLine.stroke({width: 4, color: '#000'});
            }

            this.group.text(region.name).attr({ // Chromosome labels
                x: x + width/2,
                y: LABEL_OFFSET,
                "text-anchor": "middle",
                "font-weight": "bold"
            });

            x += width;
        }
        return null;
    }
}

export default Chromosomes;