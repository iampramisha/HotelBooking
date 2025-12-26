// Create a custom error class "errorHandler" that extends the built-in JavaScript Error class
class errorHandler extends Error {
  // Declare a property to hold the HTTP status code for the error
  statusCode: number;

  // The constructor takes an error message and a status code
  constructor(errMessage: string, statusCode: number) {
    // Call the parent class (Error) constructor with the error message
    // "super" is required here so that the Error's built-in behavior is preserved
   //किन super चाहिन्छ?
// super(errMessage) ले parent class Error को constructor चलाउँछ।

// Error class को constructor ले message जस्ता property हरु सेट गर्छ र error को stack trace तयार गर्छ।

// बिना super() बोलाए, तपाईंको errorHandler क्लासले त्यो message र stack trace पाउँदैन।

// साथै, JavaScript/TypeScript मा, जब extends गरेर नयाँ constructor बनाइन्छ, super() बिना this प्रयोग गर्दा Error आउँछ:

// "Must call super constructor in derived class before accessing 'this'"


    super(errMessage);

    // Assign the custom status code to this instance
    this.statusCode = statusCode;

    // (Optional but recommended) Maintain proper stack trace for where our error was thrown
    // Only works in V8 (Node.js, Chrome)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Export the class so it can be used in other files
export default errorHandler;
