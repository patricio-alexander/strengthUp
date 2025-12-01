export enum Filter {
  Weekly = "weekly",
  TwoWeeks = "2weeks",
  ThreeMonths = "3months",
  SixMonths = "6months",
}

export type Filters = {
  range: Filter;
  title: string;
  active: boolean;
};
