import React from 'react'
import { connect } from 'react-redux'
import interact from 'interact.js'

import AnimatedItemContainer from './AnimatedItemContainer'
import Edge from './Edge'
import { updateWindowSize, unexpand, unfocus } from '../actions'

let Canvas = React.createClass({

    componentDidMount() {
        window.addEventListener('resize', this.props.updateWindowSize)
        this.props.updateWindowSize()

        window.addEventListener('keydown', (event)=>{
            if (event.keyCode==27) {
                this.props.unfocus()
                this.props.unexpand()
            }
        })

        interact(this.refs['canvas']).on('tap', event => {
            this.props.unfocus()
            this.props.unexpand()
            event.stopPropagation()
        })
    },

    render() {
         let {ItemComponent, canvasSize, visibleItems, edges, unexpand} = this.props
         return (
            <div ref='canvas' id='canvas' style={canvasSize}>
                <svg id='edges'>
                    {Object.keys(edges).map(edgeId => (
                        <Edge edgeId={edgeId} {...edges[edgeId]} key={edgeId} />
                    ))}
                </svg>
                {
                    Object.keys(visibleItems).map(itemId => (
                        <AnimatedItemContainer
                            itemId={itemId}
                            ItemComponent={ItemComponent}
                            key={itemId}
                        />
                    ))
                }
            </div>
        )
    }
})


function mapStateToProps(state) {
    state = state.canvas // TODO make us get only this namespace
    return {
        canvasSize: state.canvasSize,
        visibleItems: state.visibleItems,
        edges: state.edges,
    }
}

function mapDispatchToProps(dispatch) {
    let dispatchUpdateWindowSize = () => dispatch(updateWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
    }))

    let dispatchUnexpand = () => dispatch(unexpand({animate: true}))
    let dispatchUnfocus = () => dispatch(unfocus())

    return {
        updateWindowSize: dispatchUpdateWindowSize,
        unexpand: dispatchUnexpand,
        unfocus: dispatchUnfocus,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
