import { Node } from "../app-interfaces/node";

/**
 * Finds guranteed shortest path between start and end nodes.
 * @param grid 
 * @param startNode 
 * @param endNode 
 */
export function dijkstra(grid: Node[][], startNode: Node, endNode: Node) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);

    while(Boolean(unvisitedNodes.length)) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        if (closestNode.isWall) continue; //skip wall node

        //occurs when surrounded by walls/visited nodes
        if (closestNode.distance === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        if (closestNode === endNode) return visitedNodesInOrder;
        updateUnvisitedNeighbors(closestNode,grid);
    }
    return visitedNodesInOrder;
}

/**
 * Updates the distance from start to currently adjacent nodes by adding 1
 * @param node 
 * @param grid 
 */
function updateUnvisitedNeighbors(node: Node,grid: Node[][]) {
    const unvisitedNeighbors: Node[] = getUnvisitedNeighbors(node,grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}

/**
 * Returns adjacent unvisited neighbors
 * @param node 
 * @param grid 
 */
function getUnvisitedNeighbors(node: Node, grid: Node[][]): Node[] {
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
function getAllNodes(grid: Node[][]) : Node[] {
    const nodes: Node[] = [];
    for(const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

/**
 * Sorts all nodes by distance from startnode
 * @param unvisitedNodes flattened grid
 */
function sortNodesByDistance(unvisitedNodes: Node[]) : void {
    unvisitedNodes.sort((nodeA,nodeB) => nodeA.distance - nodeB.distance);
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