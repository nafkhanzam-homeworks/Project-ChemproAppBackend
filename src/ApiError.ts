export default class ApiError {
	// TODO: RE-CHECK, RE-LEARN STATUS CODE, THESE ARE STILL PREDICTION CODES.
	public static readonly INTERNAL_SERVER_ERROR = new ApiError(500, "Internal server error.");
	public static readonly BAD_REQUEST = new ApiError(400, "Bad request.");
	public static readonly NOT_LOGGED_IN = new ApiError(401, "You're not logged in.");
	public static readonly AUTH_TOKEN_INVALID = new ApiError(400, "Authentication invalid.");
	public static readonly NOT_PERMITTED = new ApiError(403, "Not permitted.");
	public static readonly NOT_FOUND = new ApiError(404, "Not Found.");
	public static readonly LOGOUT_FIRST = new ApiError(400, "You're currently logged in! Please logout first.");
	public static readonly USERNAME_EMAIL_NOT_EXIST = new ApiError(400, "Username or email does't exist.");
	public static readonly WRONG_PASSWORD = new ApiError(400, "Wrong password.");
	public static readonly ALREADY_LOGGED_OUT = new ApiError(400, "Already logged out.");
	public static readonly EMAIL_ALREADY_REGISTERED = new ApiError(400, "Email already registered.");

	public static readonly DEFAULT = ApiError.INTERNAL_SERVER_ERROR;
	public formattedMessage: string;
	constructor(public statusCode: number, public message: string) {
		this.formattedMessage = `Error ${this.statusCode}: ${this.message}`;
	}
	// static convertErrorToApiError(obj: { statusCode?: number, status?: number } | number): ApiError {
	// 	switch (typeof obj === 'number' ? obj : obj.statusCode || obj.status || 500) {
	// 		case 500: return ApiError.INTERNAL_SERVER_ERROR;
	// 		case 400: return ApiError.BAD_REQUEST;
	// 		case 404: return ApiError.NOT_FOUND;
	// 	}
	// 	return ApiError.DEFAULT;
	// }
}
