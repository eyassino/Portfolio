import './App.css';
import * as React from 'react';
import {useEffect, useRef, useState} from "react";
import Button from "@mui/material/Button";

function AlgorithmsPage() {
    let cols;
    let rows;
    let boxSize = 25;

    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    cols = Math.floor(windowWidth / boxSize / 1.5);
    rows = Math.floor(windowHeight / boxSize / 1.5);
    const [grid, setGrid] = useState(
        Array.from({length: rows}, () => Array(cols).fill(false))
    );

    const [isDrawing, setIsDrawing] = useState(false);
    const [isMovingStart, setIsMovingStart] = useState(false);
    const [isMovingEnd, setIsMovingEnd] = useState(false);
    const changedDuringDrag = useRef(new Set());
    const [algRunning, setAlgRunning] = useState(false);
    const [startCol, setStartCol] = useState(Math.floor(cols/5));
    const [startRow, setStartRow] = useState(Math.floor(rows/2));
    const [endCol, setEndCol] = useState(Math.floor(cols/1.2));
    const [endRow, setEndRow] = useState(Math.floor(rows/2));

    useEffect(() => {
        // Setting the start box at a specific position
        setGrid((prevGrid) =>
            prevGrid.map((r, i) =>
                i === startRow
                    ? r.map((box, j) =>
                        j === startCol ? { ...box, type: "start" } : box
                    )
                    : r
            )
        );
    }, [startRow, startCol]);

    useEffect(() => {
        // Setting the finish box at a specific position
        setGrid((prevGrid) =>
            prevGrid.map((r, i) =>
                i === endRow
                    ? r.map((box, j) =>
                        j === endCol ? { ...box, type: "destination" } : box
                    )
                    : r
            )
        );
    }, [endRow, endCol]);

    const toggleBox = (row, col) => {
        setGrid((prevGrid) =>
            prevGrid.map((r, i) =>
                i === row
                    ? r.map((box, j) =>
                        j === col && box.type !== "start" && box.type !== "destination"
                            ? {...box, type: box.type === "selected" ? null : "selected"}
                            : box
                    )
                    : r
            )
        );
        changedDuringDrag.current.add(`${row}-${col}`);
    };

    const moveStart = (row, col) => {
        if(grid[row][col]?.type !== "destination") {
            setCell(startRow, startCol, "");
            setCell(row, col, "start");
            setStartRow(row);
            setStartCol(col);
        }
    };

    const moveEnd = (row, col) => {
        if(grid[row][col]?.type !== "start") {
            setCell(endRow, endCol, "");
            setCell(row, col, "destination");
            setEndRow(row);
            setEndCol(col);
        }
    };

    const handleMouseDown = (row, col) => {
        if(!algRunning) {
            if(grid[row][col]?.type === "start") {
                setIsMovingStart(true);
            }
            else if(grid[row][col]?.type === "destination") {
                setIsMovingEnd(true);
            }
            else {
                setIsDrawing(true);
                toggleBox(row, col);
            }
        }
    };

    const handleMouseEnter = (row, col) => {
        if (isDrawing && !changedDuringDrag.current.has(`${row}-${col}`)) {
            toggleBox(row, col);
        }
        else if (isMovingStart){
            moveStart(row, col);
        }
        else if (isMovingEnd){
            moveEnd(row, col);
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        setIsMovingEnd(false);
        setIsMovingStart(false);
        changedDuringDrag.current.clear();
    };

    function setCell(x,y,type){
        setGrid((prevGrid) =>
            prevGrid.map((r, i) =>
                i === x
                    ? r.map((box, j) =>
                        j === y ? { ...box, type: type } : box
                    )
                    : r
            )
        );
    }

    function sleep(){
        return new Promise(resolve => setTimeout(resolve, 5));
    }

    async function bfs() {
        setAlgRunning(true);
        const directions = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0]
        ];

        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        const queue = [];
        queue.push([startRow, startCol, [[startRow, startCol]]]); // Initial state

        visited[startRow][startCol] = true;

        while (queue.length > 0) {
            // Dequeue
            const [currentRow, currentCol, pathSoFar] = queue.shift();

            // Check if target reached, if yes send it
            if (grid[currentRow][currentCol]?.type === "destination") {
                await pathFound(pathSoFar);
                return;
            }

            // Explore neighbors in all 4 directions
            for (const [dr, dc] of directions) {
                const newRow = currentRow + dr;
                const newCol = currentCol + dc;

                if (
                    newRow >= 0 && newRow < rows &&
                    newCol >= 0 && newCol < cols &&
                    !visited[newRow][newCol] &&
                    grid[newRow][newCol]?.type !== "selected"
                ) {
                    if (grid[newRow][newCol]?.type !== "destination") {
                        setCell(newRow, newCol, "algSeen");
                    }
                    visited[newRow][newCol] = true;
                    queue.push([newRow, newCol, [...pathSoFar, [newRow, newCol]]]);
                }
            }
            await sleep();
        }

        setAlgRunning(false);
        return []; // No path found
    }

    async function pathFound(path) {
        for(const [row, col] of path) {
            if(grid[row][col]?.type !== "destination" && grid[row][col]?.type !== "start") {
                setCell(row, col, "path");
                await sleep();
            }
        }
        setAlgRunning(false);
    }

    const resetGrid = () => {
        setGrid(
            Array.from({ length: rows }, (_, rowIndex) =>
                Array.from({ length: cols }, (_, colIndex) => {
                    if (rowIndex === startRow && colIndex === startCol) {
                        return { type: "start" };
                    } else if (rowIndex === endRow && colIndex === endCol) {
                        return { type: "destination" };
                    } else {
                        return { type: null };
                    }
                })
            )
        );
    };

    return (
        <div className="main-body">
            <div
                className="algorithm-box"
                style={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                }}
                onMouseLeave={handleMouseUp} // Stop drawing if the mouse leaves the grid
            >
                {grid.map((row, rowIndex) =>
                    row.map((box, colIndex) => {
                        const boxClass = box.type || "";
                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`box ${boxClass}`}
                                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                                onMouseUp={handleMouseUp}
                            ></div>
                        );
                    })
                )}
            </div>
            <div>
                <Button onClick={bfs}>Run BFS</Button>
                <Button onClick={resetGrid}>Clear</Button>
            </div>
        </div>
    );
}

export default AlgorithmsPage;
