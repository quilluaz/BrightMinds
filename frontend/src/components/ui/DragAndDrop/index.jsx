import React, { useState, useEffect } from "react";
import "./DragAndDropComponent.css";

const DragAndDropComponent = ({
  question,
  onAnswerSelected,
  selectedAnswers,
  isAnswerLocked,
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropZones, setDropZones] = useState([]);
  const [draggableItems, setDraggableItems] = useState([]);

  // Initialize draggable items and drop zones from question data
  useEffect(() => {
    if (question?.answers) {
      // For drag and drop, we expect answers to have dragdrop_position for ordering
      const sortedAnswers = [...question.answers].sort(
        (a, b) => (a.dragdropPosition || 0) - (b.dragdropPosition || 0)
      );

      setDraggableItems(sortedAnswers);
      setDropZones(Array(sortedAnswers.length).fill(null));
    }
  }, [question]);

  const handleDragStart = (e, item) => {
    if (isAnswerLocked) return;
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, dropZoneIndex) => {
    e.preventDefault();
    if (isAnswerLocked || !draggedItem) return;

    const newDropZones = [...dropZones];
    const newDraggableItems = [...draggableItems];

    // Remove item from its current position if it was already placed
    const currentDropZoneIndex = newDropZones.findIndex(
      (zone) => zone?.answerId === draggedItem.answerId
    );
    if (currentDropZoneIndex !== -1) {
      newDropZones[currentDropZoneIndex] = null;
    }

    // Place item in new drop zone
    newDropZones[dropZoneIndex] = draggedItem;
    setDropZones(newDropZones);

    // Remove from draggable items if it's the first time placing
    if (currentDropZoneIndex === -1) {
      setDraggableItems(
        newDraggableItems.filter(
          (item) => item.answerId !== draggedItem.answerId
        )
      );
    }

    setDraggedItem(null);

    // Check if all items are placed and validate the order
    const allPlaced = newDropZones.every((zone) => zone !== null);
    if (allPlaced) {
      validateAnswer(newDropZones);
    }
  };

  const validateAnswer = (finalOrder) => {
    // Check if the order matches the correct sequence
    // For drag and drop, we assume the correct order is based on dragdropPosition
    const correctOrder = [...question.answers].sort(
      (a, b) => (a.dragdropPosition || 0) - (b.dragdropPosition || 0)
    );

    const isCorrect = finalOrder.every(
      (item, index) => item && item.answerId === correctOrder[index].answerId
    );

    // Create a choice-like object for compatibility with existing answer handling
    const dragDropAnswer = {
      choiceId: `dragdrop_${question.questionId}`,
      isCorrect: isCorrect,
      dragdropOrder: finalOrder.map((item) => item.answerId),
      answerText: finalOrder.map((item) => item.answerText).join(", "),
    };

    onAnswerSelected(dragDropAnswer);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const resetAnswer = () => {
    if (isAnswerLocked) return;
    setDropZones(Array(question.answers.length).fill(null));
    setDraggableItems(
      [...question.answers].sort(
        (a, b) => (a.dragdropPosition || 0) - (b.dragdropPosition || 0)
      )
    );
  };

  if (!question?.answers) {
    return (
      <div className="text-white text-center">
        <p>No drag and drop data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Drop Zones */}
      <div className="grid grid-cols-2 gap-4">
        {dropZones.map((item, index) => (
          <div
            key={index}
            className={`drop-zone min-h-[80px] border-2 border-dashed rounded-lg p-4 flex items-center justify-center transition-colors ${
              item
                ? "filled border-bmGreen bg-bmGreen/20"
                : "border-bmYellow/50 hover:border-bmYellow"
            }`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}>
            {item ? (
              <div className="text-center">
                <div className="text-bmGreen font-pressStart text-sm mb-1">
                  Position {index + 1}
                </div>
                <div className="text-white font-pressStart text-lg">
                  {item.answerText}
                </div>
              </div>
            ) : (
              <div className="text-bmYellow/70 font-pressStart text-sm">
                Drop here
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Draggable Items */}
      {draggableItems.length > 0 && (
        <div className="space-y-3">
          <div className="text-white font-pressStart text-center mb-3">
            Drag the items to the correct order:
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {draggableItems.map((item) => (
              <div
                key={item.answerId}
                draggable={!isAnswerLocked}
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
                className={`drag-item p-3 bg-gray-700 border-2 border-bmYellow rounded-lg cursor-pointer transition-colors hover:bg-gray-600 ${
                  isAnswerLocked ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  draggedItem?.answerId === item.answerId ? "dragging" : ""
                }`}>
                <div className="text-white font-pressStart text-center">
                  {item.answerText}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Button */}
      {!isAnswerLocked && dropZones.some((zone) => zone !== null) && (
        <div className="text-center">
          <button
            onClick={resetAnswer}
            className="bg-bmRed text-white px-4 py-2 rounded font-pressStart hover:bg-red-600 transition-colors">
            Reset
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="text-gray-300 font-pressStart text-sm text-center">
        Drag the items above to arrange them in the correct order
      </div>
    </div>
  );
};

export default DragAndDropComponent;
