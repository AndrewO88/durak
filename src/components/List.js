import { Droppable } from 'react-beautiful-dnd';
import React from 'react';
import Card from './Card';


const List = ({ listId, cards, isDropDisabled, isDragDisabled }) => {

  return (
    <Droppable droppableId={listId} isDropDisabled={isDropDisabled}>
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            background: 'lightgray',
            padding: 8,
            width: 250,
            minHeight: 200,


            margin: 8,
            borderRadius: 4,
          }}
        >
          {cards.map((card, index) => (
            <Card key={card.id} card={card} index={index} isDragDisabled={isDragDisabled} />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default List;