// Standardized response helpers
function sendSuccess(res, data = null, message = "Success", statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function sendError(res, error, statusCode = 500) {
  const status = error.statusCode || statusCode;
  res.status(status).json({
    success: false,
    message: error.message || "An error occurred",
    details: error.details || null,
  });
}

function sendPaginatedResponse(
  res,
  data,
  page,
  limit,
  total,
  message = "Retrieved successfully"
) {
  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

module.exports = {
  sendSuccess,
  sendError,
  sendPaginatedResponse,
};
