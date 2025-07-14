const { constants } = require("../constants");

exports.errorhandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  // res.json({ message: err.message, stack: err.stack, statusCode: statusCode });

  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: "Validation Failed",
        message: err.message,
        stackTrace: err.stack,
        statusCode: statusCode,
      });
      break;
    case constants.UNAUTHORIZED:
      res.json({
        title: "Unauthorized",
        message: err.message,
        stackTrace: err.stack,
        statusCode: statusCode,
      });
      break;

    case constants.FORBIDDEN:
      res.json({
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack,
        statusCode: statusCode,
      });
      break;

    case constants.NOT_FOUND:
      res.json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack,
        statusCode: statusCode,
      });
      break;

    case constants.SERVER_ERROR:
      res.json({
        title: "Server Error",
        message: err.message,
        stackTrace: err.stack,
        statusCode: statusCode,
      });
      break;
    default:
      console.log("No error found, all good...", statusCode);
      break;
  }

  console.log();
};
