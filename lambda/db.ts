import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export class Database {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async putItem(item: any) {
    return ddbDocClient.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      })
    );
  }

  async getItem(key: any) {
    return ddbDocClient.send(
      new GetCommand({
        TableName: this.tableName,
        Key: key,
      })
    );
  }

  async updateItem(item: any) {
    return ddbDocClient.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id: item.id },
        UpdateExpression: 'set reviewText = :reviewText',
        ExpressionAttributeValues: {
          ':reviewText': item.reviewText,
        },
        ReturnValues: 'UPDATED_NEW',
      })
    );
  }

  async deleteItem(key: any) {
    return ddbDocClient.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: key,
      })
    );
  }

  async scanTable() {
    return ddbDocClient.send(
      new ScanCommand({
        TableName: this.tableName,
      })
    );
  }
}
