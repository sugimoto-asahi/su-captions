import { DuplicateColumnError } from "./column-engine";

export class DuplicateCaptionIdError extends Error {
  constructor(id: number) {
    super(`Caption ID "${id}" is already in use.`);
    this.name = "DuplicateCaptionIdError";
  }
}

export class NoSuchCaptionIdError extends Error {
  constructor(id: number) {
    super(`Caption ID "${id}" does not exist.`);
    this.name = "NoSuchCaptionIdError";
  }
}

class Node {
  start: number;
  end: number;
  left: Node | undefined;
  right: Node | undefined;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }

  hasLeft(): boolean {
    return this.left !== undefined;
  }

  hasRight(): boolean {
    return this.right !== undefined;
  }

  isLeaf(): boolean {
    return !this.hasLeft() && !this.hasRight();
  }
}

/**
 * Manages caption ids across all tracks
 * Caption ids are positive integers that start at 1
 */
export class CaptionIdManager {
  private root: Node | undefined;

  /**
   * Add a new caption ID
   *
   * @param id Caption ID to add
   */
  add(id: number) {
    if (this.isIdInUse(id)) {
      throw new DuplicateCaptionIdError(id);
    }

    if (this.root === undefined) {
      this.root = new Node(id, id);
    } else {
      let current = this.root;
      while (true) {
        if (id === current.start - 1) {
          current.start = id;
          if (current.isLeaf()) {
            break;
          }
          current = current.left!;
          continue;
        } else if (id === current.end + 1) {
          current.end = id;
          if (current.isLeaf()) {
            break;
          }
          current = current.right!;
          continue;
        } else {
          // we cannot add this id to any existing nodes, so we have to
          // create a new one
          if (current.isLeaf()) {
            // this only occurs for the root node
            let newRoot: Node;
            let newLeft: Node;
            let newRight: Node;
            if (id < current.start) {
              newRoot = new Node(id, current.end);
              newLeft = new Node(id, id);
              newRight = current;
            } else {
              newRoot = new Node(current.start, id);
              newLeft = current;
              newRight = new Node(id, id);
            }
            newRoot.right = newRight;
            newRoot.left = newLeft;
            this.root = newRoot;
            break;
          }
          if (id > current.left!.end && id < current.right!.start) {
            // we want to create the node at this level

            // First check for the case where this new id will "bridge"
            // the left and right nodes
            if (current.left!.end + 1 === current.right!.start - 1) {
              // consolidate the left and right nodes
              current.start = current.left!.start;
              current.end = current.right!.end;

              current.left = undefined;
              current.right = undefined;

              break;
            }

            // we prefer inserting on the left side
            const newParent = new Node(current.left!.start, id);
            const newNode = new Node(id, id);
            newParent.left = current.left!;
            newParent.right = newNode;

            current.left! = newParent;
          } else {
            if (id >= current.left!.start && id <= current.left!.end) {
              current = current.left!;
            } else if (id >= current.right!.start && id <= current.right!.end) {
              current = current.right!;
            }
          }
        }
      }
    }
  }

  /**
   * Remove an existing caption id
   * @param id Caption id to remove
   *
   * @throws NoSuchCaptionIdError If the specified caption id does not exist
   */
  remove(id: number) {
    if (this.root === undefined) {
      throw new NoSuchCaptionIdError(id);
    }
    let current = this.root!;
    while (true) {
      if (id === current.start) {
        // this only occurs at the root
        if (current.isLeaf()) {
          if (current.start === current.end) {
            // the root only contains one element and it is being removed
            this.root = undefined;
          } else {
            current.start += 1;
          }
          break;
        }

        current.start += 1;

        if (current.left!.isLeaf()) {
          if (current.left!.start === current.left!.end) {
            // current.left is a node containing one element, and it is
            // being removed
            current.left = undefined;
            current.right = undefined;
          } else {
            current.left!.start += 1;
          }
          break;
        }
        current = current.left!;
        continue;
      } else if (id === current.end) {
        // this only occurs at the root
        if (current.isLeaf()) {
          if (current.start === current.end) {
            // the root only contains one element and it is being removed
            this.root = undefined;
          } else {
            current.end -= 1;
          }
          break;
        }

        current.end -= 1;

        if (current.right!.isLeaf()) {
          if (current.right!.start === current.right!.end) {
            // current.right is a node containing one element, and it is
            // being removed
            current.left = undefined;
            current.right = undefined;
          } else {
            current.right!.end += 1;
          }
          break;
        }
        current = current.right!;
        continue;
      } else {
        let next: Node;

        // this only occurs at the root
        if (current.isLeaf()) {
          const newLeft = new Node(current.start, id - 1);
          const newRight = new Node(current.end, id + 1);
          current.left = newLeft;
          current.right = newRight;
          break;
        }

        // check child nodes
        if (id >= current.left!.start && id <= current.left!.end) {
          next = current.left!;
        } else if (id >= current.right!.start && id <= current.right!.end) {
          next = current.right!;
        } else {
          throw new NoSuchCaptionIdError(id);
        }

        if (next.isLeaf()) {
          const newLeft = new Node(current.left!.start, id - 1);
          const newRight = new Node(current.right!.end, id + 1);
          next.left = newLeft;
          next.right = newRight;
          break;
        } else {
          current = next;
        }
      }
    }
  }

  isIdInUse(id: number) {
    if (this.root === undefined) {
      return false;
    }
    let current = this.root!;
    let isLeafYet: boolean = current.isLeaf();
    while (!isLeafYet) {
      if (id >= current.left!.start && id <= current.left!.end) {
        current = current.left!;
      } else if (id >= current.left!.start && id <= current.left!.end) {
        current = current.right!;
      } else {
        return false;
      }
      if (current.isLeaf()) {
        isLeafYet = true;
      }
    }

    return id >= current.start && id <= current.end;
  }

  /**
   * Retrieves the smallest unused ID
   * @returns The smallest unused ID
   */
  getAvailableId(): number {
    if (this.root === undefined || this.root.start != 1) {
      return 1;
    }
    let current: Node = this.root!;
    let isLeafYet: boolean = current.isLeaf();
    while (!isLeafYet) {
      current = current.left!;
      if (current.isLeaf()) {
        isLeafYet = true;
      }
    }
    return current.end + 1;
  }

  print(): string {
    const lines: string[] = [];
    lines.push(`[${this.root.start}, ${this.root.end}]`);
    this.printChildren(this.root, "", lines);
    console.log(lines.join("\n"));
    return lines.join("\n");
  }

  private printChildren(node: Node, prefix: string, lines: string[]): void {
    const branches: [string, Node | undefined][] = [
      ["L", node.left],
      ["R", node.right],
    ];
    const present = branches.filter(
      (b): b is [string, Node] => b[1] !== undefined,
    );
    present.forEach(([label, child], index) => {
      const isLast = index === present.length - 1;
      lines.push(
        prefix +
          (isLast ? "└── " : "├── ") +
          `${label}: [${child.start}, ${child.end}]`,
      );
      this.printChildren(child, prefix + (isLast ? "    " : "│   "), lines);
    });
  }
}
