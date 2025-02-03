import './App.css';
import * as React from 'react';
import {useEffect, useRef, useState} from "react";
import Button from "@mui/material/Button";
import {Box, Menu, MenuItem, Slider, Typography} from "@mui/material";

function AlgorithmsPage() {
    const [isMobile] = useState(window.innerWidth <= 768);
    let cols;
    let rows;
    let boxSize = isMobile ? 12 : 25;

    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    cols = Math.floor(windowWidth / boxSize / 1.5);
    rows = Math.floor(windowHeight / boxSize / 1.5);

    if (isMobile){
        rows = Math.floor(rows / 1.5);
    }

    const [grid, setGrid] = useState(
        Array.from({ length: rows }, () =>
            Array.from({ length: cols }, () => ({ type: null }))
        )
    );

    const [isDrawing, setIsDrawing] = useState(false);
    const [isMovingStart, setIsMovingStart] = useState(false);
    const [isMovingEnd, setIsMovingEnd] = useState(false);
    const [startCol, setStartCol] = useState(Math.floor(cols/5));
    const [startRow, setStartRow] = useState(Math.floor(rows/2));
    const [endCol, setEndCol] = useState(Math.floor(cols/1.2));
    const [endRow, setEndRow] = useState(Math.floor(rows/2));
    const [hoveredRow, setHoveredRow] = useState(null);
    const [hoveredCol, setHoveredCol] = useState(null);
    const [algRunning, setAlgRunning] = useState(false);
    const [instructionsHidden, setInstructionsHidden] = useState(false);

    const changedDuringDrag = useRef(new Set());
    const algRunningRef = useRef(false);
    const animSpeedRef = useRef(4);

    const setAlgRunningRef = (bool) => { // Used for disabling functionality to not break stuff
        algRunningRef.current = bool;
        setAlgRunning(bool); // This is here because for some reason react does not render when ref is updated, but does
    };                      // when useState is updated, so for buttons to not be disabled we need to use state rather than ref


    const setAnimSpeedRef = (val) => {
        animSpeedRef.current = val;
    };

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
            setCell(startRow, startCol, "", true);
            setCell(row, col, "start");
            setStartRow(row);
            setStartCol(col);
        }
        else{
            setCell(startRow, startCol, "start");
        }
    };

    const moveEnd = (row, col) => {
        if(grid[row][col]?.type !== "start") {
            setCell(endRow, endCol, "", true);
            setCell(row, col, "destination");
            setEndRow(row);
            setEndCol(col);
        }
        else{
            setCell(startRow, startCol, "destination");
        }
    };

    const handleMouseDown = (row, col) => {
        if(!algRunningRef.current) {
            softResetGrid();
            if(grid[row][col]?.type === "start") {
                setIsMovingStart(true);
                setCell(row, col, "", true);
            }
            else if(grid[row][col]?.type === "destination") {
                setIsMovingEnd(true);
                setCell(row, col, "", true);
            }
            else {
                setIsDrawing(true);
                toggleBox(row, col);
            }
        }
    };

    const handleMouseEnter = (row, col) => {
        setHoveredRow(row);
        setHoveredCol(col);

        if (isDrawing && !changedDuringDrag.current.has(`${row}-${col}`)) {
            toggleBox(row, col);
        }
    };

    const handleMouseUp = (row, col) => {
        if (row > rows && col > cols){
            if (isMovingStart){
                moveStart(startRow, startCol);
            }
            else if (isMovingEnd){
                moveEnd(endRow, endCol);
            }
        }
        else if (isMovingStart){
            moveStart(row, col);
            setIsMovingStart(false);
        }
        else if (isMovingEnd){
            moveEnd(row, col);
            setIsMovingEnd(false);
        }
        setIsDrawing(false);
        changedDuringDrag.current.clear();
    };

    const handleMouseLeave = () => {
        if (isMovingStart){
            moveStart(startRow, startCol);
            setIsMovingStart(false);
        }
        else if (isMovingEnd){
            moveEnd(endRow, endCol);
            setIsMovingEnd(false);
        }
        else{
            setIsDrawing(false);
            changedDuringDrag.current.clear();
        }
        setHoveredRow(null);
        setHoveredCol(null);
    };

    const handleTouchStart = (e, row, col) => {
        e.preventDefault();
        handleMouseDown(row, col);
    }

    const handleTouchMove = (e, row, col) => {
        e.preventDefault();
        handleMouseEnter(row, col);
    }

    const handleTouchEnd = (e, row, col) => {
        e.preventDefault();
        handleMouseUp(row, col);
        handleMouseLeave();
    }

    function setCell(x, y, type, vital = false) {
        if ((grid[x]?.[y]?.type === "start" || grid[x]?.[y]?.type === "destination") && !vital) {
            return;
        }
        setGrid((prevGrid) => {
            const newGrid = prevGrid.map((row) => [...row]); // Copy rows to avoid mutating state directly
            newGrid[x][y] = { ...newGrid[x][y], type: type };             // Update only the targeted cell
            return newGrid;                                               // Return the updated grid
        });
    }

    function bfs() {
        setAlgRunningRef(true); // Need a useRef to get instant changes
        softResetGrid();
        const directions = [ // All possible directions (this one does not move diagonally)
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0]
        ];

        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        const queue = [];
        queue.push([startRow, startCol, [[startRow, startCol]]]); // Initiate

        visited[startRow][startCol] = true;

        const algStep = () => {
            for(let i = 0; i < animSpeedRef.current; i++) {    // This is so the user can decide how fast the animation is

                if (queue.length === 0 || !algRunningRef.current) {    // It is achieved by running multiple steps at once
                    setAlgRunningRef(false);
                    return;
                }

                // Dequeue
                const [currentRow, currentCol, pathSoFar] = queue.shift();

                // Check if target reached, if yes send it
                if (grid[currentRow][currentCol]?.type === "destination") {
                    void pathFound(pathSoFar);
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
            }
            requestAnimationFrame(algStep);
        };

        algStep();
    }

    function sleep(){
        return new Promise(resolve => setTimeout(resolve, 5));
    }

    async function pathFound(path) {
        for(const [row, col] of path) {
            if (!algRunningRef.current) { // If user stopped alg, don't do the path, doubt this will be used tho
                return;
            }
            if(grid[row][col]?.type !== "destination" && grid[row][col]?.type !== "start") {
                setCell(row, col, "path");
            }
            await sleep(); // delaying the path painting like in the algorithm, but with in an easier way
        }
        setAlgRunningRef(false);
    }

    const resetGrid = () => {
        setAlgRunningRef(false);
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

    const softResetGrid = () => { // Reset but don't touch the walls
        setGrid((prevGrid) =>
            prevGrid.map((row) =>
                row.map((box) =>
                    box.type === "algSeen" || box.type === "path" ? { ...box, type: null } : box,
                )
            )
        );
    };

    const handleSlider = (event, newValue) => {
        setAnimSpeedRef(newValue);
    };

    function fillGrid (){ // Used for making the maze, since this algorithm works by breaking walls rather than putting them up
        setGrid(
            Array.from({ length: rows }, (_, rowIndex) =>
                Array.from({ length: cols }, (_, colIndex) => {
                    if (rowIndex === startRow && colIndex === startCol) {
                        return { type: "start" };
                    } else if (rowIndex === endRow && colIndex === endCol) {
                        return { type: "destination" };
                    } else {
                        return { type: "selected" };
                    }
                })
            )
        );
    }
    function mazeCreator () { // Uses backtracking algorithm for the maze creation
        setAlgRunningRef(true); // Need a useRef to get instant changes
        softResetGrid();
        fillGrid();
        const directions = [ // All possible directions (this one does not move diagonally)
            [0, 2],                // Increments of two to avoid overwriting things
            [2, 0],
            [0, -2],
            [-2, 0]
        ];

        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        const stack = [];
        stack.push([startRow, startCol]); // Initiate
        visited[startRow][startCol] = true;

        const algStep = () => {
            for(let i = 0; i < Math.ceil(animSpeedRef.current/2); i++) { // This is so the user can decide how fast the animation is
                if (stack.length === 0 || !algRunningRef.current) {     // It is achieved by running multiple steps at once
                    setAlgRunningRef(false);                    // division by 2 since it is quite fast if not divided
                    clearAroundEnd();
                    return;
                }

                const [currentRow, currentCol] = stack[stack.length - 1];

                // This is for the algorithm to know which cells are unvisited, used to know which "walls" not to break
                const neighbors = directions
                    .map(([dr, dc]) => [currentRow + dr, currentCol + dc])
                    .filter(([newRow, newCol]) =>
                        newRow >= 0 && newRow < rows &&
                        newCol >= 0 && newCol < cols &&
                        !visited[newRow][newCol]
                    );


                if (neighbors.length > 0) {
                    // Pick a random neighbor
                    const [newRow, newCol] = neighbors[Math.floor(Math.random() * neighbors.length)];
                    const wallRow = (currentRow + newRow) / 2;
                    const wallCol = (currentCol + newCol) / 2;

                    // Mark the wall and the new cell as visited and part of the maze
                    if (grid[newRow][newCol]?.type !== "destination" && grid[wallRow][wallCol]?.type !== "destination") {
                        setCell(wallRow, wallCol, "");
                        setCell(newRow, newCol, "");
                    }
                    visited[wallRow][wallCol] = true;
                    visited[newRow][newCol] = true;

                    // Add the new cell to the stack
                    stack.push([newRow, newCol]);
                } else {
                    stack.pop(); // Backtrack if no unvisited neighbors remain
                }
            }
            requestAnimationFrame(algStep);
        };

        algStep();
    }

    function clearAroundEnd () {
        setCell(endRow, endCol+1, ""); // I don't like doing this but
        setCell(endRow+1, endCol, ""); // Without this some mazes are unsolvable
        setCell(endRow, endCol-1, ""); // Since the alg reaches the end and then
        setCell(endRow-1, endCol, ""); // is unable to break walls it makes parts unreachable
                                               // this makes it so it is guaranteed to reach it at least
                                               // Could make a path then a maze around it, but I don't like that solution either
    }

    const handleHideButton = () => {
        setInstructionsHidden(true)
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [algSelection, setAlgSelection] = React.useState(isMobile ? "Alg Select" : "Algorithm selection");
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const bfsSelected = () => {
        setAnchorEl(null);
        setAlgSelection("Breadth first search (Dijkstra)");
    };

    const dfsSelected = () => {
        setAnchorEl(null);
        setAlgSelection("Depth first search");
    };

    const aStarSelected = () => {
        setAnchorEl(null);
        setAlgSelection("A*");
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    function dfs () {
        setAlgRunningRef(true); // Need a useRef to get instant changes
        softResetGrid();
        const directions = [ // All possible directions (this one does not move diagonally)
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0]
        ];

        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        visited[startRow][startCol] = true;
        const stack = [];
        stack.push([startRow, startCol, [[startRow, startCol]]]); // Initiate

        const algStep = () => {
            for (let i = 0; i < animSpeedRef.current; i++) {    // This is so the user can decide how fast the animation is

                if (stack.length === 0 || !algRunningRef.current) {    // It is achieved by running multiple steps at once
                    setAlgRunningRef(false);
                    return;
                }

                const [currentRow, currentCol, pathSoFar] = stack.pop();

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
                        else {
                            void pathFound(pathSoFar);
                            return;
                        }
                        visited[newRow][newCol] = true;
                        stack.push([newRow, newCol, [...pathSoFar, [newRow, newCol]]]);
                    }
                }
            }
            requestAnimationFrame(algStep);
        };

        algStep();
    }

    function aStar() {
        setAlgRunningRef(true); // Need a useRef to get instant changes
        softResetGrid();
        const directions = [ // All possible directions (this one does not move diagonally)
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0]
        ];

        const heuristic = (x,y) => {
            return Math.sqrt((x - endRow) ** 2 + (y - endCol) ** 2); // Euclidean Distance
        };

        const g = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
        const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
        const queue = [];
        queue.push([heuristic(startRow, startCol), startRow, startCol, [[startRow, startCol]]]);

        g[startRow][startCol] = 0;
        visited[startRow][startCol] = true;

        const algStep = () => {
            for(let i = 0; i < animSpeedRef.current; i++) {    // This is so the user can decide how fast the animation is
                if (queue.length === 0 || !algRunningRef.current) {    // It is achieved by running multiple steps at once
                    setAlgRunningRef(false);
                    return;
                }

                queue.sort((a, b) => a[0] - b[0]);
                const [, currentRow, currentCol, pathSoFar] = queue.shift();

                // Check if target reached, if yes send it
                if (grid[currentRow][currentCol]?.type === "destination") {
                    void pathFound(pathSoFar);
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
                        const temp = g[currentRow][currentCol] + 1; // moving cost
                        if(temp < g[newRow][newCol]) {
                            if (grid[newRow][newCol]?.type !== "destination") {
                                setCell(newRow, newCol, "algSeen");
                            }
                            g[newRow][newCol] = temp;
                            const f = temp + heuristic(newRow, newCol);
                            visited[newRow][newCol] = true;
                            queue.push([f, newRow, newCol, [...pathSoFar, [newRow, newCol]]]);
                        }
                    }
                }
            }
            requestAnimationFrame(algStep);
        };

        algStep();
    }

    function runAlgorithm() {
        switch (algSelection) {
            case "Breadth first search (Dijkstra)":
                bfs();
                break;
            case "Depth first search":
                dfs();
                break;
            case "A*":
                aStar();
                break;
            default:
                bfs();
                break;
        }
    }

    return (
        <div>
            <div hidden={instructionsHidden}
                className="popup"
                style={{
                    placeContent: "center"
                }}
            >
                <header>
                    <h2>Instructions
                        <Button variant="outlined" color="inherit" style={{marginLeft: 1 + 'em'}} onClick={handleHideButton}>Hide</Button>
                    </h2>
                </header>
                <p>Click and drag to draw "walls" that act as blockers to the algorithm, click and drag again to remove them.
                    <br/>
                    <br/>The
                    <span style={{color: "green"}}> green </span>
                    cell is the start,
                    <span style={{color: "red"}}> red </span>
                    is the end, you can move them both by click and dragging them.
                    <br/>
                    <br/>Control the animation speed by using the slider.
                    <br/>
                    <br/>Run the pathfinding / maze generator algorithm by clicking the respective buttons at the bottom
                </p>
            </div>
            <div
                className="algorithm-box"
                style={{
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                }}
                onMouseLeave={handleMouseLeave} // Stop drawing if the mouse leaves the grid
            >
                {grid.map((row, rowIndex) =>
                    row.map((box, colIndex) => {
                        const boxClass = box.type || "";
                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                className={`box ${boxClass}`}
                                style={{
                                    backgroundColor:
                                        isMovingStart && rowIndex === hoveredRow && colIndex === hoveredCol
                                            ? "darkgreen"
                                            : isMovingEnd && rowIndex === hoveredRow && colIndex === hoveredCol
                                                ? "darkred"
                                                : undefined,
                                }}
                                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                                onMouseUp={() => handleMouseUp(rowIndex, colIndex)}
                                onTouchStart={(e) => handleTouchStart(e, rowIndex, colIndex)}
                                onTouchMove={(e) => handleTouchMove(e, rowIndex, colIndex)}
                                onTouchEnd={(e) => handleTouchEnd(e, rowIndex, colIndex)}
                            ></div>
                        );
                    })
                )}
            </div>
            <Box justifyContent="center" sx={{ display: isMobile ? `grid`: '-webkit-box'}}>
                <Box sx={{ width: 250, marginRight: isMobile ? `0em` : `1em`}}>
                    <Slider
                        aria-label="Animation speed"
                        defaultValue={4}
                        shiftStep={2}
                        step={1}
                        marks
                        min={1}
                        max={10}
                        onChange={handleSlider}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography>
                            Slow
                        </Typography>
                        <Typography>
                            Fast
                        </Typography>
                    </Box>
                </Box>
                { !isMobile &&
                <React.Fragment>

                <Button
                    color="inherit"
                    variant="outlined"
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    style={{marginRight: 1 + 'em'}}
                    onClick={handleClick}
                >
                    {algSelection}
                </Button>

                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={bfsSelected}>Breadth first search (Dijkstra)</MenuItem>
                    <MenuItem onClick={dfsSelected}>Depth first search</MenuItem>
                    <MenuItem onClick={aStarSelected}>A star</MenuItem>
                </Menu>

                <Button disabled={algRunning} style={{marginRight: 1 + 'em'}} variant="outlined" color="inherit" onClick={runAlgorithm}>{isMobile ? `Run` : `Run algorithm`}</Button>
                <Button disabled={algRunning} style={{marginRight: 1 + 'em'}} variant="outlined" color="inherit" onClick={mazeCreator}>{isMobile ? `Maze` : `Generate maze`}</Button>
                <Button variant="outlined" color="inherit" onClick={resetGrid}>Clear</Button>
                </React.Fragment>
                }

                { isMobile &&
                    <React.Fragment>
                        <Box>
                            <Button
                                color="inherit"
                                variant="outlined"
                                id="basic-button"
                                aria-controls={open ? 'basic-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                style={{marginRight: 1 + 'em'}}
                                onClick={handleClick}
                            >
                                {algSelection}
                            </Button>

                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={bfsSelected}>Breadth first search (Dijkstra)</MenuItem>
                                <MenuItem onClick={dfsSelected}>Depth first search</MenuItem>
                                <MenuItem onClick={aStarSelected}>A star</MenuItem>
                            </Menu>

                            <Button disabled={algRunning} style={{float: "right"}} variant="outlined" color="inherit" onClick={runAlgorithm}>Run</Button>
                        </Box>

                        <Box sx={{marginTop: 1 + 'em'}}>
                            <Button variant="outlined" style={{float: "right"}} color="inherit" onClick={resetGrid}>Clear</Button>
                            <Button disabled={algRunning} style={{float: "left"}} variant="outlined" color="inherit" onClick={mazeCreator}>Maze</Button>
                        </Box>
                    </React.Fragment>
                }

            </Box>
        </div>
    );
}

export default AlgorithmsPage;
