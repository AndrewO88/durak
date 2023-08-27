import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import List from './List';


const initialData = {
  lists: [
    {
      id: 'list-1',
      isPlayer: true,
      cards: [
        { id: 'card-1', content: 'Card 1' },
        { id: 'card-2', content: 'Card 2' },
        { id: 'card-3', content: 'Card 3' },
        { id: 'card-4', content: 'Card 4' },
        { id: 'card-5', content: 'Card 5' },
        { id: 'card-6', content: 'Card 6' },
      ],
    },
    {
      id: 'list-2',
      isPlayer: true,
      cards: [
        { id: 'card-7', content: 'Card 7 (disabled)' },
        { id: 'card-8', content: 'Card 8' },
        { id: 'card-9', content: 'Card 9' },
        { id: 'card-10', content: 'Card 10' },
        { id: 'card-11', content: 'Card 11' },
        { id: 'card-12', content: 'Card 12' },
      ],
    },
    {
      id: 'list-3',
      isBase: true,
      cards: [],
    },

  ],
};


const Board = () => {
  const [lists, setLists] = useState(initialData.lists);
  const [droppableId, setDroppableId] = useState(null);

  const updateCardOrder = (listId, newIndex, oldIndex) => {
    const updatedLists = lists.map((list) => {
      if (list.id === listId) {
        const updatedCards = [...list.cards];
        const [movedCard] = updatedCards.splice(oldIndex, 1);
        updatedCards.splice(newIndex, 0, movedCard);
        return { ...list, cards: updatedCards };
      }
      return list;
    });

    setLists(updatedLists);
  };

  const moveCard = (source, destination) => {
    const sourceList = lists.find((list) => list.id === source.droppableId);
    const destinationList = lists.find(
      (list) => list.id === destination.droppableId,
    );

    const sourceCards = [...sourceList.cards];
    const destinationCards = [...destinationList.cards];
    const [movedCard] = sourceCards.splice(source.index, 1);
    destinationCards.splice(destination.index, 0, movedCard);

    const updatedLists = lists.map((list) => {
      if (list.id === sourceList.id) {
        return { ...list, cards: sourceCards };
      } else if (list.id === destinationList.id) {
        return { ...list, cards: destinationCards };
      }
      return list;
    });

    setLists(updatedLists);
  };

  const handleMoveCardClick = () => {
    const cardToMove = lists[1].cards[1];
    const updatedSecondListCards = [...lists[1].cards];
    updatedSecondListCards.splice(1, 1);
    const updatedThirdListCards = [...lists[2].cards, cardToMove];

    const updatedLists = lists.map((list, index) => {
      if (index === 1) {
        return { ...list, cards: updatedSecondListCards };
      } else if (index === 2) {
        return { ...list, cards: updatedThirdListCards };
      }
      return list;
    });
    
    setLists(updatedLists);
  };

  const onDragEnd = (result) => {
    setDroppableId(null);
    if (!result.destination) return;

    if (
      result.source.droppableId === result.destination.droppableId &&
      result.source.index === result.destination.index
    ) {
      return;
    }

    if (result.source.droppableId === result.destination.droppableId) {
      updateCardOrder(result.source.droppableId, result.destination.index, result.source.index);
    } else {
      moveCard(result.source, result.destination);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={(e) => setDroppableId(e.source.droppableId)}>
      <div style={{ display: 'flex' }}>
        {lists.map((list) => (
          <List
            key={list.id}
            listId={list.id}
            cards={list.cards}
            updateCardOrder={updateCardOrder}
            moveCard={moveCard}
            isDragDisabled={list.isBase}
            isDropDisabled={list.isPlayer && droppableId !== list.id}
          />
        ))}
      </div>
      <button onClick={handleMoveCardClick}>Move Card => list-2[1]</button>
    </DragDropContext>
  );
};

export default Board;