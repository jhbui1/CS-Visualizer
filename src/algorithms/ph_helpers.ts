import { Node } from "../app/pathfinder/app-interfaces/node";

/**
 * Returns adjacent unvisited neighbors
 * @param node 
 * @param grid 
 */
export function getUnvisitedNeighbors(node: Node, grid: Node[][]): Node[] {
    const neighbors: Node[] = [];
    const {row,col} = node;

    //node above
    if (row > 0) neighbors.push(grid[row - 1][col]);

    //node below
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);

    //node to left
    if (col > 0) neighbors.push(grid[row][col - 1]);

    //node to right
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

    return neighbors.filter(neighbor => !neighbor.isVisited);
}


/**
 * returns flattened grid
 * @param grid 2d representation of grid
 */
export function getAllNodes(grid: Node[][]) : Node[] {
    const nodes: Node[] = [];
    for(const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}


/**
 * builds path from end node to start, must be called after djikstra call
 * @param finishNode 
 */
export function getNodesInShortestPathOrder(finishNode:Node): Node[] {
    const shortestPath: Node[] = [];
    let currentNode: Node = finishNode;
    while(currentNode !== null) {
        shortestPath.push(currentNode.previousNode);
        currentNode = currentNode.previousNode;
    }
    return shortestPath;
}
