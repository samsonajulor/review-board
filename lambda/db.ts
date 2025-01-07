import * as AWS from 'aws-sdk';

const db = new AWS.DynamoDB.DocumentClient();

export class Database {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async putItem(item: any) {
    return db.put({ TableName: this.tableName, Item: item }).promise();
  }

  async getItem(key: any) {
    return db.get({ TableName: this.tableName, Key: key }).promise();
  }

  async updateItem(item: any) {
    return db.put({ TableName: this.tableName, Item: item }).promise();
  }

  async deleteItem(key: any) {
    return db.delete({ TableName: this.tableName, Key: key }).promise();
  }

  async scanTable() {
    return db.scan({ TableName: this.tableName }).promise();
  }
}
