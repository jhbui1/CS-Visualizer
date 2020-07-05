import { Node } from '../app/pathfinder/app-interfaces/node';
import * as PFHelpers from './ph_helpers';

export function dfs(grid: Node[][], startNode: Node, endNode: Node) {
    const visitedNodesInOrder = [];
    let queue = [startNode];

    while (Boolean(queue.length)) {
        let currentNode = queue.pop(); 
        if(currentNode.isWall) continue;
        visitedNodesInOrder.push(currentNode); 
        
        if(currentNode === endNode) {
            return visitedNodesInOrder;
        } else if(!currentNode.isVisited) {
            currentNode.isVisited = true;
            
            const adjacentNodes = PFHelpers.getUnvisitedNeighbors(currentNode,grid);
            for(const node of adjacentNodes) {
                node.previousNode = currentNode;
                queue.push(node);
            }
        }
    }
    return visitedNodesInOrder;
}


