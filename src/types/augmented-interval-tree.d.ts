declare module 'augmented-interval-tree' {
  export default class IntervalTree<T> {
    constructor()
    insert(interval: [number, number], value?: T): void
    search(low: number, high: number): Array<[number, number, T?]>
  }
}
