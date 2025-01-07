import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, GetCommand, DeleteCommand, ScanCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export class Database {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async putItem(item: any) {
    const command = new PutCommand({ TableName: this.tableName, Item: item });
    return ddbDocClient.send(command);
  }

  async getItem(key: any) {
    const command = new GetCommand({ TableName: this.tableName, Key: key });
    return ddbDocClient.send(command);
  }

  async deleteItem(key: any) {
    const command = new DeleteCommand({ TableName: this.tableName, Key: key });
    return ddbDocClient.send(command);
  }

  async scanTable() {
    const command = new ScanCommand({ TableName: this.tableName });
    return ddbDocClient.send(command);
  }
}
