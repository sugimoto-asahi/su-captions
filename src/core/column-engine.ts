export class DuplicateColumnError extends Error {
  /**
   * Construct a DuplicateColumnError
   *
   * @param column Name of duplicate column
   */
  constructor(column: string) {
    super(`Column '${column}' is a duplicate.`);
  }
}

export class ColumnEngine {
  private maxWidth: number;

  // column names
  private columnPositionMap: Map<string, number> = new Map();
  private columnMap: Map<string, number> = new Map();
  private columns: string[];

  /**
   * Construct a ColumnEngine.
   * A ColumnEngine encapsulates the width calculations for an arbitrary
   * set of columns. Supports operations like resizings of particular columns.
   * Will always ensure that the set of all columns spans the maximum width.
   *
   * @param columns List of column headers
   * @param maxWidth Width constraint (how wide the table holding these columns is)
   * @returns Initalized ColumnEngine
   */
  constructor(columns: string[], maxWidth: number) {
    const columnSet = new Set<string>();
    this.maxWidth = maxWidth;
    this.columnCount = columns.length;
    this.columns = columns;

    // start each column with equal length
    const startingWidth = maxWidth / columns.length;
    columns.forEach((column, index) => {
      if (columnSet.has(column)) {
        throw new DuplicateColumnError(column);
      } else {
        columnSet.add(column);
      }
      this.columnPositionMap.set(column, index);
      this.columnMap.set(column, startingWidth);
    });
  }

  /**
   * Retrieve the width of a column
   *
   * @param name - Name of column
   * @returns Width of column
   */
  getWidth(column: string): number | undefined {
    return this.columnMap.get(column);
  }

  /**
   * Resize a column.
   * Let the column to be resized be LEFT and the column to the right of this
   * column be RIGHT.
   * RIGHT will resize itself as well such that width(LEFT) + width(RIGHT)
   * remains the same pre- and post-resize.
   *
   * @param column Name of column to resize
   * @param newWidth New width to give the column
   * @note The last column cannot be resized. Its size is always automatically
   * determined.
   */
  resize(column: string, newWidth: number): void {
    if (this.isLastColumn(column)) {
      return;
    }
    const leftWidth = this.columnMap.get(column)!;
    const rightColumn = this.columns[this.columnPositionMap.get(column)! + 1];
    const rightWidth = this.columnMap.get(rightColumn)!;
    const newRightWidth = leftWidth + rightWidth - newWidth;

    this.columnMap.set(column, newWidth);
    this.columnMap.set(rightColumn, newRightWidth);
  }

  /**
   * Checks if the column is the last column
   * @param column Name of column to check
   */
  isLastColumn(column: string): boolean {
    return this.columnPositionMap.get(column) === this.columns.length - 1;
  }

  /**
   * Set a new max width for the table and scale all columns accordingly
   * @param newMaxWidth New maximum width
   */
  updateMaxWidth(newMaxWidth: number): void {
    const ratio = newMaxWidth / this.maxWidth;
    for (const column of this.columns) {
      const currentWidth = this.columnMap.get(column)!;
      this.columnMap.set(column, currentWidth * ratio);
    }
    this.maxWidth = newMaxWidth;
  }
}
