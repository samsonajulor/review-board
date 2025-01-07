### **ReviewBoard Backend Documentation**

#### This project was bootstrapped with `cdk init app --language typescript`

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

---

## **1. Overview**
The **ReviewBoard Backend** is a modular and scalable backend system built to manage customer reviews, perform sentiment analysis, and provide a secure API for CRUD operations. It leverages **AWS services** for authentication, storage, API management, and monitoring, ensuring robust performance and scalability.

This backend is intended for businesses that want to integrate customer feedback management into their workflows. Sentiment analysis is powered by **AWS Comprehend**, making it easier to extract insights from customer reviews.

---

## **2. Features**
- **Secure Authentication**: AWS Cognito for user authentication and Role-Based Access Control (RBAC).
- **RESTful API**: API Gateway for managing CRUD operations on reviews.
- **Scalable Storage**: DynamoDB for storing reviews and supporting efficient queries with Global Secondary Index (GSI).
- **AI/ML Integration**: AWS Comprehend for real-time sentiment analysis.
- **Modular Architecture**: Construct-based implementation for better maintainability and scalability.
- **Logging and Monitoring**: CloudWatch for detailed metrics and logs.
- **Error Handling**: Dead Letter Queue (DLQ) for handling failed events.

---

## **3. Tech Stack**
### **Core Technologies**
1. **AWS CDK**: Infrastructure as Code (IaC) to provision and manage AWS resources.
2. **AWS Cognito**: User authentication and authorization.
3. **AWS Lambda**: Serverless compute for CRUD operations and sentiment analysis.
4. **AWS DynamoDB**: NoSQL database for scalable data storage.
5. **AWS Comprehend**: Natural Language Processing (NLP) for sentiment analysis.
6. **AWS CloudWatch**: Logging and monitoring for APIs and Lambdas.
7. **AWS API Gateway**: Secure RESTful API for accessing backend services.
8. **AWS SQS**: Dead Letter Queue for handling Lambda invocation failures.

---

## **4. Architecture Workflow**

### **4.1 User Authentication**
1. Users authenticate using AWS Cognito, which provides JWT tokens.
2. Tokens are verified by API Gateway before granting access to endpoints.
3. RBAC:
   - **Admin**: Full access to all CRUD operations.
   - **User**: Restricted to read-only access.

---

### **4.2 CRUD Operations Workflow**
1. **Create Review**:
   - Client sends a `POST` request to `/reviews` with a review text.
   - The `CreateReviewFunction` Lambda:
     - Stores the review in DynamoDB.
     - Calls AWS Comprehend to analyze sentiment.
   - Response includes the stored review and its sentiment analysis.

2. **Get Review(s)**:
   - Client sends a `GET` request to `/reviews` (all reviews) or `/reviews/{id}` (specific review).
   - The `GetReviewFunction` Lambda fetches data from DynamoDB.

3. **Update Review**:
   - Client sends a `PUT` request to `/reviews/{id}` with updated review details.
   - The `UpdateReviewFunction` Lambda updates the DynamoDB record and re-analyzes sentiment.

4. **Delete Review**:
   - Client sends a `DELETE` request to `/reviews/{id}`.
   - The `DeleteReviewFunction` Lambda deletes the record from DynamoDB.

---

### **4.3 Sentiment Analysis Workflow**
1. **Triggered by POST and PUT requests**.
2. AWS Comprehend analyzes the sentiment (`Positive`, `Negative`, `Neutral`, or `Mixed`).
3. Sentiment score is added to the DynamoDB record for insights.

---

### **4.4 Error Handling**
1. **Dead Letter Queue (DLQ)**:
   - If a Lambda function fails, the event is sent to an SQS queue for debugging.
2. **CloudWatch Logs**:
   - All requests and errors are logged for monitoring and debugging.

---

## **5. API Documentation**

### **Endpoints**
| Method | Endpoint          | Description                  |
|--------|--------------------|------------------------------|
| POST   | `/reviews`         | Create a new review          |
| GET    | `/reviews`         | Get all reviews              |
| GET    | `/reviews/{id}`    | Get a specific review        |
| PUT    | `/reviews/{id}`    | Update a specific review     |
| DELETE | `/reviews/{id}`    | Delete a specific review     |

---

### **Request and Response Examples**

#### **POST `/reviews`**
**Request:**
```json
{
  "reviewText": "The service was excellent!"
}
```

**Response:**
```json
{
  "message": "Review created",
  "item": {
    "id": "123456789",
    "createdAt": "2025-01-07T12:00:00.000Z",
    "reviewText": "The service was excellent!",
    "sentiment": "POSITIVE",
    "sentimentScore": {
      "Positive": 0.95,
      "Negative": 0.01,
      "Neutral": 0.04,
      "Mixed": 0.00
    }
  }
}
```

#### **GET `/reviews`**
**Response:**
```json
[
  {
    "id": "123456789",
    "createdAt": "2025-01-07T12:00:00.000Z",
    "reviewText": "The service was excellent!",
    "sentiment": "POSITIVE",
    "sentimentScore": {
      "Positive": 0.95,
      "Negative": 0.01,
      "Neutral": 0.04,
      "Mixed": 0.00
    }
  },
  {
    "id": "987654321",
    "createdAt": "2025-01-06T11:00:00.000Z",
    "reviewText": "Terrible experience.",
    "sentiment": "NEGATIVE",
    "sentimentScore": {
      "Positive": 0.01,
      "Negative": 0.98,
      "Neutral": 0.01,
      "Mixed": 0.00
    }
  }
]
```

#### **PUT `/reviews/{id}`**
**Request:**
```json
{
  "reviewText": "The service was good overall."
}
```

**Response:**
```json
{
  "message": "Review updated",
  "item": {
    "id": "123456789",
    "createdAt": "2025-01-07T12:00:00.000Z",
    "reviewText": "The service was good overall.",
    "sentiment": "POSITIVE",
    "sentimentScore": {
      "Positive": 0.80,
      "Negative": 0.05,
      "Neutral": 0.15,
      "Mixed": 0.00
    }
  }
}
```

#### **DELETE `/reviews/{id}`**
**Response:**
```json
{
  "message": "Review deleted"
}
```

---

## **6. Setup Instructions**

### **6.1 Prerequisites**
1. Install [Node.js](https://nodejs.org/), [AWS CLI](https://aws.amazon.com/cli/), and [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html).
2. Configure AWS CLI:
   ```bash
   aws configure
   ```

### **6.2 Install Dependencies**
1. Clone the repository:
   ```bash
   git clone https://github.com/samsonajulor/review-board-backend.git
   cd review-board-backend
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```

### **6.3 Deploy the Stack**
1. Bootstrap the environment:
   ```bash
   cdk bootstrap
   ```
2. Deploy the stack:
   ```bash
   cdk deploy
   ```

### **6.4 Testing**
1. Note the API Gateway URL and Cognito User Pool ID from the deployment output.
2. Use Postman or curl to test the API endpoints.

---

## **7. Monitoring and Debugging**
1. **CloudWatch Logs**:
   - View Lambda logs in the AWS Management Console under CloudWatch.
2. **CloudWatch Metrics**:
   - Monitor API Gateway latency and error rates.
3. **Dead Letter Queue**:
   - Check SQS for failed Lambda events.

---

## **8. Future Improvements**
1. **Batch Sentiment Analysis**:
   - Process multiple reviews in a single request.
2. **Frontend Dashboard**:
   - Build a dashboard for businesses to visualize sentiment trends.
3. **Thematic Analysis**:
   - Use AWS Comprehend to identify recurring themes in customer feedback.
