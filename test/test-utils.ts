import axios from 'axios';
import * as dotenv from 'dotenv';
import { CognitoIdentityProviderClient, AdminInitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import * as crypto from 'crypto';

dotenv.config();

export const mockEvent = (claims: any, body: any = {}): APIGatewayProxyEvent => ({
  body: JSON.stringify(body),
  headers: {},
  multiValueHeaders: {},
  httpMethod: 'POST',
  isBase64Encoded: false,
  path: '/reviews',
  pathParameters: null,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {
    accountId: '123456789012',
    apiId: 'testApi',
    authorizer: { claims },
    httpMethod: 'POST',
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: '127.0.0.1',
      user: null,
      userAgent: 'jest-test',
      userArn: null,
    },
    path: '/reviews',
    protocol: 'HTTP/1.1',
    requestId: 'test-request-id',
    requestTime: '10/Oct/2023:12:00:00 +0000',
    requestTimeEpoch: 1696939200000,
    resourceId: 'testResourceId',
    resourcePath: '/reviews',
    stage: 'test',
  },
  resource: '/reviews',
});

export const mockContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: 'testFunction',
  functionVersion: '1',
  invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:testFunction',
  memoryLimitInMB: '128',
  awsRequestId: '12345',
  logGroupName: '/aws/lambda/testFunction',
  logStreamName: '2021/11/15/[$LATEST]abcdef1234567890',
  getRemainingTimeInMillis: () => 5000,
  done: () => undefined,
  fail: () => undefined,
  succeed: () => undefined,
};


const calculateSecretHash = (username: string, clientId: string, clientSecret: string): string => {
  const hmac = crypto.createHmac('sha256', clientSecret);
  hmac.update(username + clientId);
  return hmac.digest('base64');
};

const BASE_URL = process.env.API_URL || 'https://urzhxzr168.execute-api.us-east-1.amazonaws.com/prod/';
const USER_POOL_ID = process.env.USER_POOL_ID || 'your-user-pool-id';
const CLIENT_ID = process.env.CLIENT_ID || 'your-client-id';
const CLIENT_SECRET = process.env.CLIENT_SECRET || 'your-client-secret';
const USERNAME = process.env.USERNAME || 'your-username';
const PASSWORD = process.env.PASSWORD || 'you-password';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'your-username';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'you-password';

console.log({
  BASE_URL,
  USER_POOL_ID,
  CLIENT_ID,
  CLIENT_SECRET,
  USERNAME,
  PASSWORD,
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
});

const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' });

export const getRealToken = async (username: string, password: string): Promise<string> => {

const secretHash = calculateSecretHash(username, CLIENT_ID, CLIENT_SECRET);
  const command = new AdminInitiateAuthCommand({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    UserPoolId: USER_POOL_ID,
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: secretHash,
    },
  });

  try {
    const response = await cognitoClient.send(command);
    if (response.AuthenticationResult?.IdToken) {
      return response.AuthenticationResult.IdToken;
    }
    throw new Error('Authentication failed: No token returned');
  } catch (error) {
    console.error('Error fetching token:', error);
    throw new Error('Failed to retrieve token');
  }
};

export const getAdminToken = async (): Promise<string> => {
  return getRealToken(ADMIN_USERNAME, ADMIN_PASSWORD);
};

export const getUserToken = async (): Promise<string> => {
  return getRealToken(USERNAME, PASSWORD);
};

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
