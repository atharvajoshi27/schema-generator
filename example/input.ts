interface Person {
  firstName: string;
  lastName: string;
  age: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: number;
  };
  favouriteColor?: "red" | "green" | "blue" | string;
}

interface User {
  _id: string;
  person: Person;
}
