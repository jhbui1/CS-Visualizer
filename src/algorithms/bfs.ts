import { Node } from "../app-interfaces/node";
import * as PFHelpers from "./ph_helpers";

export function bfs(grid: Node[][], startNode: Node, endNode: Node) {
    const visitedNodesInOrder = [];
    let queue: Node[] = [];
    startNode.isVisited = true;
    queue.unshift(startNode);

    while (Boolean(queue.length)) {
        const currentNode = queue.shift();
        if(currentNode.isWall) continue;
        visitedNodesInOrder.push(currentNode);
        if(currentNode === endNode) return visitedNodesInOrder;

        const adjacentNodes = PFHelpers.getUnvisitedNeighbors(currentNode,grid);
        for(let node of adjacentNodes) {
            updateNode(node,currentNode);
            queue.push(node);
        }
    }
}

/**
 * sets node's previous and marks as viisted
 * @param node 
 * @param previousNode 
 */
function updateNode(node: Node, previousNode: Node) {
    node.previousNode = previousNode;
    node.isVisited = true;
}