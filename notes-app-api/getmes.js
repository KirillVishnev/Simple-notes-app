import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {


  try {
    
    if (true) {
      // Return the retrieved item
      callback(null, success("hello test"));
    } else {
      callback(null, failure({ status: false, error: "err" }));
    }
  } catch (e) {
    callback(null, failure("bad err"));
  }
}