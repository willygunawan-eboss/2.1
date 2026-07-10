export const successResponse = (res: any, data: any, message = 'Success', meta: any = null) => {
  res.json({
    success: true,
    message,
    data,
    meta
  });
};

export const errorResponse = (res: any, message = 'Internal Server Error', statusCode = 500, errors: any = null) => {
  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};
