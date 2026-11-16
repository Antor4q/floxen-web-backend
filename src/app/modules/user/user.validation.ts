import z from "zod";


export const createUserZodSchema = z.object({
            name: z.string({error: "Name must be string"})
         .min(2,{message: "Name must be at least 2 character long"})
         .max(50,{message: "Name cannot exceed 50 characters."})
         .optional()
           ,
           slug: z.string().optional(),
           plan: z.string().optional(),
            email: z
            .string({error: "Email must be string"})
            .email({message: "Invalid email address format."})
            .min(5,{message: "Email must be at least 5 characters long."}).max(100, {message: "Email cannot exceed 100 characters."}),
            // 1 uppercase, 1 special character, 1 digit, 8 character min
            password:z
            .string()
            .min(8,{message:"Password must be at least 8 characters long."})
            .regex(/^(?=.*[A-Z]).+$/, {message:"Password must contain at least 1 uppercase letter."})
            .regex(/^(?=.*[^A-Za-z0-9]).+$/,{message: "password must contain at least 1 special character"})
            .regex(/^.{8,}$/,{message: "Password must contain at least 1 number."}),
          
          
    })


// export const updateUserZodSchema = z.object({
//   name: z
//     .string({ error: "Name must be string" })
//     .min(2, { message: "Name must be at least 2 characters long" })
//     .max(50, { message: "Name cannot exceed 50 characters." })
//     .optional(),

//   picture: z
//     .string({ error: "Picture must be a string" })
//     .optional(),
// });