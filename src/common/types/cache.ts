export interface Cache {
  save<T>(key: string, data: T);
}
