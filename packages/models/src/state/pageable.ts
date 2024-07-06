export type Pageable<T> = {
  data: T[];
  afterKey?: string;
  beforeKey?: string;
  limit: number;
};
