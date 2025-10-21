import React, { useState, useEffect } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, useDraggable, useDroppable } from "@dnd-kit/core";

function Mineral({ id, filePath, label, position, disabled }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style = {
    position: "absolute",
    left: position.leftPct + "%",
    top: position.topPct + "%",
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    cursor: disabled ? "default" : "grab",
    opacity: isDragging ? 0.8 : 1,
    userSelect: "none",
    pointerEvents: disabled ? "none" : "auto",
    width: "64px",
    height: "64px",
  };

  return (
    <img
      src={filePath}
      alt={label}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="puzzle-piece"
      draggable={false}
    />
  );
}

function DropTarget({ id, children, style }) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const dropStyle = {
    border: isOver ? "3px solid #4CAF50" : "2px dashed #ccc",
    borderRadius: "8px",
    width: "128px",
    height: "128px",
    position: "relative",
    ...style,
  };
  return (
    <div ref={setNodeRef} style={dropStyle}>
      {children}
    </div>
  );
}

export default function GamePage() {
  const [storyData, setStoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [placedPiece, setPlacedPiece] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Start drag after moving 8px
      },
    })
  );

  useEffect(() => {
    async function fetchStory() {
      try {
        const response = await fetch("http://localhost:8080/api/seeder/story", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ /* add any body data if required here */ }),
        });
        const data = await response.json();
        setStoryData(data);
        setLoading(false);

        // Initialize puzzle pieces from the first scene with a question
        const scene = data.scenes.find((s) => s.question);
        if (scene && scene.question && scene.question.answers) {
          const positions = [
            { leftPct: 10, topPct: 20 },
            { leftPct: 40, topPct: 20 },
            { leftPct: 10, topPct: 60 },
            { leftPct: 40, topPct: 60 },
          ];
          const pieces = scene.question.answers.map((answer, i) => {
            const asset = scene.assets.find((a) => a.name === answer.assetName);
            return {
              id: answer.assetName,
              label: answer.answerText,
              filePath: asset?.filePath || "",
              position: positions[i % positions.length],
              isCorrect: answer.isCorrect,
            };
          });
          setPuzzlePieces(pieces);
        }
      } catch (error) {
        console.error("Failed to load story data:", error);
        setLoading(false);
      }
    }
    fetchStory();
  }, []);

  if (loading) {
    return <div>Loading story...</div>;
  }
  if (!storyData) {
    return <div>Failed to load story data.</div>;
  }

  const handleDragEnd = ({ active, over }) => {
    if (over && active.id) {
      const draggedItem = puzzlePieces.find((p) => p.id === active.id);
      if (draggedItem.isCorrect && over.id === "drop-target") {
        setPlacedPiece(draggedItem);
        setFeedback("Correct! ✨");
      } else {
        setFeedback("Try again! ❌");
      }
    }
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <div style={{ position: "relative", width: "600px", height: "400px", border: "1px solid #ccc" }}>
          <DropTarget id="drop-target" style={{ position: "absolute", left: "70%", top: "30%" }}>
            {placedPiece ? (
              <img
                src={placedPiece.filePath}
                alt={placedPiece.label}
                style={{ width: "128px", height: "128px" }}
                draggable={false}
              />
            ) : (
              <div
                style={{
                  width: "128px",
                  height: "128px",
                  lineHeight: "128px",
                  textAlign: "center",
                  fontSize: "48px",
                  userSelect: "none",
                }}
              >
                ?
              </div>
            )}
          </DropTarget>

          {puzzlePieces.map(
            (piece) =>
              placedPiece?.id === piece.id ? null : (
                <Mineral
                  key={piece.id}
                  id={piece.id}
                  filePath={piece.filePath}
                  label={piece.label}
                  position={piece.position}
                  disabled={false}
                />
              )
          )}
        </div>

        <div style={{ marginTop: "10px", fontSize: "18px", height: "24px" }}>{feedback}</div>
      </DndContext>
    </>
  );
}