export class Node {
    constructor (
        public col: number,
        public row: number,
        public isStart: boolean,
        public isFinish: boolean,
        public distance: number,
        public isVisited: boolean,
        public isWall: boolean,
        public previousNode: Node
    ) {};
}