import React from 'react'
import ChartCard from '../../../components/ChartCard/ChartCard.jsx';

import {
	DragSource
} from 'react-dnd'
const boxSource = {
	beginDrag(props) {
		props.beginDrag()
		console.log(props)
		return {}
	},
	endDrag(props, monitor) {
		props.endDrag()
		if (!monitor.didDrop()) {
			return
		}
	},
	canDrag(props){
		return props.isAllowDrap
	}
}

@DragSource(
	'box',
	boxSource,
	(connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		connectDragPreview: connect.dragPreview(),
		isDragging: monitor.isDragging(),
		canDrag: monitor.canDrag()
	})
)
class View extends React.Component {
	render() {
		const {
			isDragging,
			children,
			connectDragSource,
			title,
			canDrag
		} = this.props
		return (
			<div className={`item ${!canDrag ? 'not-allow-drap' : ''}`}>
				{
					connectDragSource(
						<div className={isDragging ? 'drop drop-loading' : 'drop'}>
							<ChartCard
								title={title}
								type='charts'
							>
								{children}
							</ChartCard>
						</div>
					)
				}
			</div>
		)
	}
}

export default View