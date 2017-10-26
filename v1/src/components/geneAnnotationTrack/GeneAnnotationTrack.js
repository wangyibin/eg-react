import React from 'react';

import AnnotationArranger from './AnnotationArranger';
import GeneDetail from './GeneDetail';
import GeneDataSource from '../../dataSources/GeneDataSource';

import SvgContainer from '../SvgContainer';
import Track from '../Track';
import TrackLegend from '../TrackLegend';
import TrackLoadingNotice from '../TrackLoadingNotice';
import ScrollingData from '../ScrollingData';

const HEIGHT = 120;

/**
 * A gene annotation track.
 * 
 * @author Silas Hsu
 */
class GeneAnnotationTrack extends Track {
    static TYPE_NAME = "gene annotation";

    constructor(props) {
        super(props);
        this.state.geneDetail = null;

        this.divNode = null;
        this.geneClicked = this.geneClicked.bind(this);
    }

    makeDefaultDataSource() {
        return new GeneDataSource();
    }

    /**
     * Called when a gene annotation is clicked.  Sets state so a detail box is displayed.
     * 
     * @param {MouseEvent} event 
     * @param {Gene} gene 
     */
    geneClicked(event, gene) {
        event.stopPropagation();
        let detail = <GeneDetail
            left={event.clientX}
            top={event.clientY}
            rightBoundary={this.divNode.clientWidth}
            gene={gene}
        />;
        this.setState({geneDetail: detail});
    }

    render() {
        let svgStyle = {paddingTop: 10, display: "block"};
        if (this.state.error) {
            svgStyle.backgroundColor = "red";
        }
        
        return (
        <div
            style={{display: "flex", borderBottom: "1px solid grey"}}
            ref={node => this.divNode = node}
            onClick={(event) => this.setState({geneDetail: null})}
        >
            <TrackLegend height={HEIGHT} trackModel={this.props.trackModel} />
            {this.state.isLoading ? <TrackLoadingNotice height={this.props.height} /> : null}
            <ScrollingData
                width={this.props.width}
                height={HEIGHT}
                regionExpander={this.props.regionExpander}
                xOffset={this.props.xOffset}
            >
                <SvgContainer
                    model={this.props.regionExpander.makeExpandedRegion(this.props.viewRegion)}
                    drawModelWidth={this.props.regionExpander.expandWidth(this.props.width)}
                    svgProps={{style: svgStyle}}
                >
                    {this.state.data ? 
                        <AnnotationArranger
                            data={this.state.data}
                            viewRegion={this.props.viewRegion}
                            onGeneClick={this.geneClicked}
                            maxRows={this.props.maxRows}
                        />
                        : null
                    }
                </SvgContainer>
            </ScrollingData>
            {this.state.geneDetail}
        </div>
        );
    }
}

export default GeneAnnotationTrack;
