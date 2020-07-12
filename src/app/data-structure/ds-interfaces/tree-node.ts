interface NamedParameters {
    value : string,
    parent ?: TreeNode,
    left ?: TreeNode,
    right ?: TreeNode
    level ?: number,
    x ?: number,
    y ?: number,
    newNode ?: boolean 
}

export class TreeNode {
    x     : number;
    level : number;
    right : TreeNode;
    left  : TreeNode;
    parent: TreeNode;
    value : string;
    y: number;
    newNode: boolean
    constructor ({
        value,
        parent, 
        left    = null,
        right   = null,
        level   = 0,
        x       = 0,
        y       = 0,
        newNode = true
    } : NamedParameters
    ) {
        this.value   = value;
        this.parent  = parent;
        this.left    = left;
        this.right   = right;
        this.level   = level;
        this.x       = x; this.y = y;
        this.newNode = newNode
    }
}