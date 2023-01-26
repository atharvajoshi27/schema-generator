import z from "zod";
const PersonSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    age: z.number(),
    address: z
      .object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.number(),
      })
      .strict(),
    favouriteColor: z
      .union([
        z.literal("red"),
        z.literal("green"),
        z.literal("blue"),
        z.string(),
      ])
      .optional(),
  })
  .strict();
const UserSchema = z.object({ _id: z.string(), person: PersonSchema }).strict();
