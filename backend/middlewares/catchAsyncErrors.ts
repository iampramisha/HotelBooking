import { NextRequest, NextResponse } from "next/server";

type HandlerFunction = (req: NextRequest, params?: any) => Promise<NextResponse>;

interface IValidationError {
  message: string;
}

export const catchAsyncErrors =
  (handler: HandlerFunction) => async (req: NextRequest, params: any) => {
    try {
      return await handler(req, params);
    } catch (error: any) {
      if (error?.name === "CastError") {
        error.message = `Resource not found. Invalid ${error?.path}`;
        error.statusCode = 400;
      }

      if (error?.name === "ValidationError") {
        error.message = Object.values<IValidationError>(error.errors).map(
          (value) => value.message
        );
        error.statusCode = 400;
      }

      // Handling mongoose duplicate key error
      if (error.code === 11000) {
        //key value may be name of attributes like email,name
        error.message = `Duplicate ${Object.keys(error.keyValue)} entered`;
      }

      return NextResponse.json(
        {
          errMessage: error.message,
        },
        { status: error.statusCode || 500 }
      );
    }
  };
export default catchAsyncErrors;
//notes

// Absolutely! Here’s a detailed, easy-to-understand note with code examples explaining how `catchAsyncErrors` wraps your controller function, how parameters flow, and what happens step-by-step.

// ---

// ### **Note on catchAsyncErrors Wrapper and Flow in Next.js API**

// ---

// #### What is `catchAsyncErrors`?

// `catchAsyncErrors` is a **wrapper function** (also called a higher-order function) used to simplify error handling in async functions like your API controllers.

// * It **takes your async controller function as input** (called the `handler`).
// * It **returns a new async function** that runs the handler inside a `try...catch`.
// * If the handler throws an error, the wrapper catches it and returns a proper JSON error response.

// This way, you don’t have to write repetitive `try...catch` blocks in every controller.

// ---

// #### How is it declared?

// ```ts
// import { NextRequest, NextResponse } from "next/server";

// type HandlerFunction = (req: NextRequest, params: any) => Promise<NextResponse>;

// const catchAsyncErrors = (handler: HandlerFunction) =>
//   async (req: NextRequest, params: any) => {
//     try {
//       return await handler(req, params);
//     } catch (error: any) {
//       return NextResponse.json(
//         { message: error.message },
//         { status: error.statusCode || 500 }
//       );
//     }
//   };

// export default catchAsyncErrors;
// ```

// ---

// #### How to use it in a controller function?

// Example controller function (for getting room details):

// ```ts
// import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/backend/config/dbConfig";
// import Room from "../models/room";
// import errorHandler from "@/backend/utils/errorHandler";
// import catchAsyncErrors from "@/backend/middlewares/catchAsyncErrors";

// export const getRoomDetails = catchAsyncErrors(
//   async (
//     req: NextRequest,
//     context: { params: Promise<{ id: string }> }
//   ) => {
//     await dbConnect();

//     // Await the params because Next.js provides params as a Promise in latest versions
//     const { id } = await context.params;

//     const room = await Room.findById(id);

//     if (!room) {
//       return NextResponse.json({ message: "Room not found" }, { status: 404 });
//     }

//     // Return success response
//     return NextResponse.json({ success: true, room });
//   }
// );
// ```

// ---

// // #### Step-by-step Flow:

// // 1. **API Route Calls `getRoomDetails`**

// //    When a client (like Postman or frontend) calls the API endpoint (e.g. `/api/rooms/123`), your API route executes `getRoomDetails`.

// // 2. **`getRoomDetails` is wrapped by `catchAsyncErrors`**

// //    Because `getRoomDetails` was defined as:

// //    ```ts
//    export const getRoomDetails = catchAsyncErrors(async (req, context) => { ... });
//    ```

//    It means:

//    * The **async function you wrote** (the logic inside `async (req, context) => { ... }`) is passed as the `handler` argument to `catchAsyncErrors`.
//    * `catchAsyncErrors` returns a **new async function** that wraps your logic inside `try...catch`.

// 3. **Next.js internally calls the wrapped function**

//    The wrapped function receives:

//    * `req`: the incoming NextRequest object.
//    * `params` (or `context`): the dynamic route params object containing `{ id: Promise<{id: string}> }`.

// 4. **Inside the wrapped function**

//    * It calls your original `handler` function with `req` and `params`.
//    * Your handler awaits `context.params` to get `{ id: string }`.
//    * It uses the `id` to query the database.
//    * If everything is OK, it returns a success JSON response.

// 5. **If an error occurs inside your handler**

//    * The wrapper’s `catch` block catches the error.
//    * It sends back a JSON response with the error message and proper HTTP status code.

// ---

// #### What exactly is passed where?

// * The **wrapper function** has this signature:

// ```ts
// async (req: NextRequest, params: any) => {
//   try {
//     return await handler(req, params);  // Calls your controller function here
//   } catch (error) {
//     // Handle error here
//   }
// };
// ```

// * Your controller function is:

// ```ts
// async (
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> }
// ) => {
//   // Your controller code
// }
// ```

// * So the **`params` argument from the wrapper becomes the `context` argument in your controller**.
// * Because `params` contains a Promise (`context.params` is Promise in Next 13+), you **`await context.params` to get the actual route params** like `id`.

// ---

// ### Summary with comments:

// ```ts
// // This is your wrapper function to catch errors in async handlers
// const catchAsyncErrors = (handler: HandlerFunction) =>
//   async (req: NextRequest, params: any) => {
//     try {
//       // Call your controller function here with request and params
//       return await handler(req, params);
//     } catch (error: any) {
//       // If an error is thrown inside your controller, catch it and return JSON error response
//       return NextResponse.json(
//         { message: error.message },
//         { status: error.statusCode || 500 }
//       );
//     }
//   };

// // Your actual controller function is passed inside catchAsyncErrors as 'handler'
// export const getRoomDetails = catchAsyncErrors(
//   async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
//     // Wait to connect DB
//     await dbConnect();

//     // Wait to get route params (because Next.js provides it as Promise)
//     const { id } = await context.params;

//     // Find room by ID
//     const room = await Room.findById(id);

//     // If not found, return 404 response
//     if (!room) {
//       return NextResponse.json({ message: "Room not found" }, { status: 404 });
//     }

//     // If found, return success JSON
//     return NextResponse.json({ success: true, room });
//   }
// );
// ```

// ---

// ### **In short:**

// * You **pass your controller function as an argument to `catchAsyncErrors`**.
// * `catchAsyncErrors` returns a **new function** that runs your controller **inside a try-catch**.
// * This new function is what Next.js calls for the API.
// * When this wrapper runs, it calls your original controller with `(req, params)` arguments.
// * Your controller awaits `params` to get the actual `id`.
// * If your controller throws errors, the wrapper catches them and returns a JSON error response.

// ---

// If you want, I can also prepare a super simple analogy or diagram to explain this! Would that help?
