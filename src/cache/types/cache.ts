export interface Cache {
  get(key: string);
  set<T>(key: string, data: T);
}
