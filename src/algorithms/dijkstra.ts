import { Node } from "../app/pathfinder/app-interfaces/node";
import * as PFHelpers from "./ph_helpers";

/**
 * Finds guranteed shortest path between start and end nodes.
 * @param grid 
 * @param startNode 
 * @param endNode 
 */
export function dijkstra(grid: Node[][], startNode: Node, endNode: Node) {
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = PFHelpers.getAllNodes(grid);

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
    const unvisitedNeighbors: Node[] = PFHelpers.getUnvisitedNeighbors(node,grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
    }
}

/**
 * Sorts all nodes by distance from startnode
 * @param unvisitedNodes flattened grid
 */
function sortNodesByDistance(unvisitedNodes: Node[]) : void {
    unvisitedNodes.sort((nodeA,nodeB) => nodeA.distance - nodeB.distance);
}
