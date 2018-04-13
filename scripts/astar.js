MyGame.aStar = (function(graphics) {
    'use strict';

    var frontier = [];

    function AStar(grid) {
        let ret = {
            rows: grid.rows,
            cols: grid.cols,
            graph: null
        }

        ret.initializeGrid = function(start, end) {
            ret.graph = [];
			for(var ii = 0; ii < ret.rows; ++ii) {
                ret.graph.push([]);
                for(var jj = 0; jj < ret.cols; ++jj) {
                    let graphObject = {
                        actualCost: 0,
                        row: ii,
                        col: jj,
                        visited: false,
                        predecessor: null
                    };
                    ret.graph[ii].push(graphObject);
                }
            }
        }

        ret.getPath = function(start, end, grid) {
            frontier = [];
            ret.initializeGrid(start, end);
            ret.graph[start.row][start.col].actualCost = 0;
            enqueueFrontier(ret.graph[start.row][start.col], 0);

            while(frontier.length > 0) {
                let curr = dequeueFrontier();
                if(curr.row == end.row && curr.col == end.col) {
                    return getPathArray(curr.row, curr.col, start);
                }
                var currNeighbors = ret.getNeighbors(curr.row, curr.col, grid);
                for(var neighbor in currNeighbors) {
                    var cost = curr.actualCost + 1;
                    if(currNeighbors[neighbor].visited == false || cost < currNeighbors[neighbor].actualCost) {
                        var priority = cost + manhattanDistance(end, currNeighbors[neighbor]);
                        enqueueFrontier(currNeighbors[neighbor], priority);
                        ret.graph[currNeighbors[neighbor].row][currNeighbors[neighbor].col].visited = true;
                        ret.graph[currNeighbors[neighbor].row][currNeighbors[neighbor].col].predecessor = curr;
                    }
                }
            }
        }

        ret.getNeighbors = function(row, col, grid) {
            var neighbors = [];

            if(row - 1 >= 0 && !grid.hasTower(row - 1, col))         neighbors.push(ret.graph[row - 1][col]);
            if(row + 1 < grid.rows && !grid.hasTower(row + 1, col)) neighbors.push(ret.graph[row + 1][col]);
            if(col - 1 >= 0 && !grid.hasTower(row, col - 1))         neighbors.push(ret.graph[row][col - 1]);
            if(col + 1 < grid.cols && !grid.hasTower(row, col + 1)) neighbors.push(ret.graph[row][col + 1]);

            return neighbors;
        }

        function getPathArray(currRow, currCol, start) {
            var path = [];

            path.push(ret.graph[currRow][currCol]);

            while(true) {
                if(currRow == start.row && currCol == start.col) break;
                let predecessor = ret.graph[currRow][currCol].predecessor
                path.push(predecessor);
                currRow = predecessor.row;
                currCol = predecessor.col;
            }

            return path;
        }

        return ret;
    }

    function enqueueFrontier(graphObject, priority) {
        frontier.push({graphObject, priority});
        frontier.sort(function(a,b) {
            if(a.priority > b.priority) return -1;
            if(a.priority < b.priority) return 1;
            return 0;
        });
    }

    function dequeueFrontier() {
        return frontier.pop().graphObject;
    }

    function manhattanDistance(end, start) {
        return Math.abs(start.row - end.row) + Math.abs(start.col - end.col);
    }

    return {
        AStar : AStar,
	};
}(MyGame.graphics));