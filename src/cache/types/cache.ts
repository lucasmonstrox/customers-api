export interface Cache {
  set<T>(key: string, data: T);
}
