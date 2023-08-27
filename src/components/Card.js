import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Card = ({ card, index, isDragDisabled }) => {
    
  return (
    <Draggable draggableId={card.id} index={index} isDragDisabled={isDragDisabled || card.id === 'card-7'}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          style={{
            background: 'white',
            padding: 8,
            marginBottom: 8,
            borderRadius: 4,
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            ...provided.draggableProps.style,
          }}
        >
          {card.content}
        </div>
      )}
    </Draggable>
  );
};

export default Card;