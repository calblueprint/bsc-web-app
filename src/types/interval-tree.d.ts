declare module 'interval-tree' {
  export class IntervalTree<T> {
    constructor()
    insert(low: number, high: number, value?: T): void
    search(
      low: number,
      high: number
    ): Array<{ low: number; high: number; value?: T }>
  }
}
