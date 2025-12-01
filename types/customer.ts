export type Customer = {
  id: string;
  username: string;
  bodyStats: {
    age: number;
    weight: number;
    height: number;
  };
  roomId: string;
};
