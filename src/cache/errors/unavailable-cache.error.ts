export class UnavailableCacheError extends Error {
  constructor() {
    super();
    this.message = 'Cache is unavailable';
  }
}
