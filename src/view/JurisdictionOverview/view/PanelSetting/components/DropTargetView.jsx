import React from 'react'
import {
	DropTarget
} from 'react-dnd'

const drapEvent = {
    canDrop(props){
        if(props.current === 2 || props.current === 5){
            if(props.dropId === 3 || props.dropId === 6){
                return true
            }
            return false
        }else{
            if(props.dropId !== 3 && props.dropId !== 6){
                return true
            }
            return false
        }
    },
    drop(props){
        props.onDrop(props.current)
    }
}

@DropTarget(
    'box',
    drapEvent,
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        canDrop: !!monitor.canDrop(),
        isOver: monitor.isOver()
    })
)
class View extends React.Component{
    render(){
        const {
            connectDropTarget,
            canDrop,
            isOver
        } = this.props
        let className = ''
        if(!canDrop){
            className = 'no-drop'
        }
        if(canDrop && isOver){
            className='is-over'
        }
        return (
            // <div>
            <div className={className}>
                {connectDropTarget(this.props.children)}
            </div>
        )
    }
}

export default View