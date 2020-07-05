import { Node } from "../app/pathfinder/app-interfaces/node";
import * as PFHelpers from "./ph_helpers";

/**
 * Uses
 * @param grid 
 * @param startNode 
 * @param endNode 
 */
export function a_star(grid: Node[][], startNode: Node, endNode: Node) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    startNode.f = 0;
    const unvisitedNodes = PFHelpers.getAllNodes(grid);

    while (Boolean(unvisitedNodes.length)) {
        sortNodesByManhattan(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        if (closestNode.isWall) continue; //skip wall node
        //occurs when surrounded by walls/visited nodes
        if (closestNode.distance === Infinity) return visitedNodesInOrder;
        closestNode.isVisited = true;

        visitedNodesInOrder.push(closestNode);
        if (closestNode === endNode) return visitedNodesInOrder;
        updateUnvisitedNeighbors(closestNode,grid,endNode);
    }
}
/**
 * Updates the distance from start to currently adjacent nodes by adding 1
 * @param node 
 * @param grid 
 */
function updateUnvisitedNeighbors(node: Node,grid: Node[][],endNode: Node) {
    const unvisitedNeighbors: Node[] = PFHelpers.getUnvisitedNeighbors(node,grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.f = calculateF(node.distance+1,neighbor,endNode);
        neighbor.previousNode = node;
    }
}
/**
 * 
 * @param g  distance between given node and start node
 * @param endNode  
 */
function calculateF(g: number,currentNode:Node,endNode: Node ): number {
    return g + calculateManhattan(currentNode,endNode);
}


/**
 * calculates manhattan distance and sums with parameter g to create heuristic for A*
 * @param endNode  
 */
function calculateManhattan(currentNode:Node, endNode: Node): number {
    return Math.abs(currentNode.col - endNode.col) + Math.abs(currentNode.row - endNode.row);
}

function sortNodesByManhattan(unvisitedNodes: Node[]) {
    unvisitedNodes.sort((nodeA,nodeB) => nodeA.f - nodeB.f);
}

