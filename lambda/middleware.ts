import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as Joi from 'joi';

/**
 * Middleware to enforce RBAC based on Cognito groups.
 */
export const rbacMiddleware = (allowedGroups: string[]) => {
  return async (event: APIGatewayProxyEvent, next: () => Promise<APIGatewayProxyResult>) => {
    const claims = event.requestContext.authorizer?.claims;

    if (!claims || !allowedGroups.includes(claims['cognito:groups'])) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Access Denied' }),
      };
    }

    return next();
  };
};

/**
 * Middleware to validate request bodies using Joi.
 */
export const validationMiddleware = (schema: Joi.ObjectSchema) => {
  return async (event: APIGatewayProxyEvent, next: () => Promise<APIGatewayProxyResult>) => {
    const body = event.body ? JSON.parse(event.body) : {};

    const { error } = schema.validate(body);
    if (error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: error.details[0].message }),
      };
    }

    return next();
  };
};
