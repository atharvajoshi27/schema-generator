export enum SchemaType {
  String = "String",
  Number = "Number",
  BigInt = "BigInt",
  Boolean = "Boolean",
  Object = "Object",
  StringLiteral = "StringLiteral",
  NumberLiteral = "NumberLiteral",
  BigIntLiteral = "NumberLiteral",
  BooleanLiteral = "BooleanLiteral",
  Any = "Any",
  Undefined = "Undefined",
  Null = "Null",
  Unknown = "Unknown",
  Never = "Never",
  Interface = "Interface",
  Union = "Union",
  Literal = "Literal",
  TypeReference = "TypeReference",
}

export interface InputType {
  name?: string;
  kind?: SchemaType;
  value?: string | number | InputType | InputType[];
  optional?: boolean;
}
