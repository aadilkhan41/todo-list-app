export class ApiError extends Error {
    constructor(status, code, message) {
      super(message);
      this.name = "ApiError";
      this.status = status;
      this.code = code;
    }
  
    static badRequest(message) {
      return new ApiError(400, "BAD_REQUEST", message);
    }
  
    static notFound(message = "Resource not found") {
      return new ApiError(404, "NOT_FOUND", message);
    }
}