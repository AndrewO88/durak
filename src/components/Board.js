import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import List from './List';
import { BehaviorSubject } from 'rxjs';


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
  const [lists, setLists] = useState([]);
  const [droppableId, setDroppableId] = useState(null);
  const behaviorSubject$ = useMemo(() => new BehaviorSubject(initialData.lists), []);


  useEffect(() => {
    const subscription = behaviorSubject$.subscribe((data) => {
      setLists(data);
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const updateCardOrder = (source, destination) => behaviorSubject$.next((prevLists) => prevLists.map((list) => {
    const listId = source.droppableId;
    const newIndex = destination.index;
    const oldIndex = source.index;
    if (list.id !== listId) return list;
    const updatedCards = [...list.cards];
    const [movedCard] = updatedCards.splice(oldIndex, 1);
    updatedCards.splice(newIndex, 0, movedCard);
    return { ...list, cards: updatedCards };
  }));


  const moveCard = (source, destination) => behaviorSubject$.next((prevLists) => prevLists.map((list) => {
    const { droppableId: sourceListId, index: sourceIndex } = source;
    const { droppableId: destListId, index: destinationIndex } = destination;
    if (list.id === sourceListId) {
      const updatedSourceCards = [...list.cards];
      const [movedCard] = updatedSourceCards.splice(sourceIndex, 1);
      const destinationList = prevLists.find((l) => l.id === destListId);
      const updatedDestCards = [...destinationList.cards];
      updatedDestCards.splice(destinationIndex, 0, movedCard);
      return { ...list, cards: updatedSourceCards };
    } else if (list.id === destListId) {
      return {
        ...list,
        cards: [
          ...list.cards,
          prevLists.find((l) => l.id === sourceListId).cards[sourceIndex],
        ],
      };
    }
    return list;
  }));


  const handleMoveCardClick = () => {
    const sourceListIndex = 1;
    const destinationListIndex = 2;
    const cardIndex = 1;
    behaviorSubject$.next((prevLists) => prevLists.map((list, index) => {
      const cardToMove = prevLists[sourceListIndex].cards[cardIndex];
      const updatedSecondListCards = prevLists[sourceListIndex].cards.filter(
        (_, index) => index !== cardIndex,
      );
      const updatedThirdListCards = [
        ...prevLists[destinationListIndex].cards,
        cardToMove,
      ];
      if (index === sourceListIndex) {
        return { ...list, cards: updatedSecondListCards };
      } else if (index === destinationListIndex) {
        return { ...list, cards: updatedThirdListCards };
      }
      return list;
    }));
  };

  const onDragEnd = ({ source, destination }) => {
    setDroppableId(null);
    if ((source?.droppableId === destination?.droppableId && source.index === destination.index) || !destination) return;
    source?.droppableId === destination?.droppableId ? updateCardOrder(source, destination) : moveCard(source, destination);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={(e) => setDroppableId(e.source.droppableId)}>
      <div style={{ display: 'flex' }}>
        {lists?.map((list) => (
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