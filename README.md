### **ReviewBoard Backend Documentation**

#### This project was bootstrapped with `cdk init app --language typescript`

The `cdk.json` file tells the CDK Toolkit how to execute your app.

---

## **Useful Commands**

- `npm run build` - Compile TypeScript to JavaScript.
- `npm run watch` - Watch for changes and compile.
- `npm run test` - Run all unit and integration tests.
- `npm run test:file <test-file-path>` - Run tests for a specific file.
- `npx cdk deploy` - Deploy this stack to your default AWS account/region.
- `npx cdk diff` - Compare deployed stack with current state.
- `npx cdk synth` - Emit the synthesized CloudFormation template.

---

## **1. Overview**

The **ReviewBoard Backend** is a scalable, modular, and serverless backend application designed to manage customer reviews. It includes built-in sentiment analysis and uses AWS services for authentication, storage, monitoring, and processing.

---

## **2. Features**

- **Authentication**: AWS Cognito with Role-Based Access Control (RBAC).
- **CRUD Operations**: API Gateway for managing reviews.
- **Sentiment Analysis**: AWS Comprehend for analyzing review sentiment.
- **Scalable Storage**: DynamoDB for efficient review storage.
- **Logging and Monitoring**: CloudWatch for detailed logs and metrics.

---

## **3. Setup Instructions**

### **3.1 Prerequisites**

1. Install the following tools:
   - [Node.js](https://nodejs.org/)
   - [AWS CLI](https://aws.amazon.com/cli/)
   - [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html)

2. Configure AWS CLI:
   ```bash
   aws configure
   ```

---

### **3.2 Install Dependencies**

1. Clone the repository:
   ```bash
   git clone https://github.com/samsonajulor/review-board.git
   cd review-board
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

---

### **3.3 Environment Variables**

1. Locate the `.env.sample` file in the project root.

2. Create a new `.env` file:
   ```bash
   cp .env.sample .env
   ```

3. Replace placeholder values with your custom configuration:
   ```plaintext
   USER_POOL_ID="us-east-1_174sYvq2f"
   CLIENT_ID="6s7vncinogc4h6j10avsdk367o"
   CLIENT_SECRET="1co7dsv6mernqt56i4gh5e0rf3pf30fl0o0lsmb6nbt7483u0rok"
   API_URL="https://h7aatxhnf4.execute-api.us-east-1.amazonaws.com/prod/"
   ADMIN_USERNAME="samson@gmail.com"
   ADMIN_PASSWORD="Aee3adgadgadg12@@!"
   USERNAME="samsonajulor@gmail.com"
   PASSWORD="Aee3adgadgadg12@@!"
   ```

---

### **3.4 Deploy the Stack**

1. Bootstrap the AWS environment:
   ```bash
   cdk bootstrap
   ```

2. Deploy the application:
   ```bash
   npx cdk deploy
   ```

3. Note the **API Gateway URL** and **Cognito User Pool ID** from the deployment output.

---

### **3.5 Cognito Setup**

1. **Create an App Client**:
   - Navigate to the **Cognito Console**.
   - Select your User Pool (`ReviewBoardUserPool` created by CDK).
   - Create an App Client (e.g., `ReviewBoardClient`).
   - Disable "Generate client secret" (unless needed).
   - Note the **Client ID** and **Client Secret**, if applicable.

2. **Update User Passwords**:
   - Use the AWS CLI to update passwords for users created in the Cognito User Pool:
     ```bash
     aws cognito-idp admin-set-user-password \
       --user-pool-id <USER_POOL_ID> \
       --username <USERNAME> \
       --password <PASSWORD> \
       --permanent
     ```

3. **Add Users to Groups**:
   - Use the AWS CLI to add users to groups:
     ```bash
     aws cognito-idp admin-add-user-to-group \
       --user-pool-id <USER_POOL_ID> \
       --username <USERNAME> \
       --group-name <GROUP_NAME>
     ```

Example:
```bash
aws cognito-idp admin-add-user-to-group \
  --user-pool-id us-east-1_174sYvq2f \
  --username samson@tezda.com \
  --group-name Admins
```

---

## **4. Testing Instructions**

### **4.1 Unit Tests**

1. **Run All Unit Tests**:
   ```bash
   npx jest test/unit --runInBand
   ```

2. **Run Unit Tests for a Specific File**:
   ```bash
   npx jest test/unit/<test-file-name>.test.ts
   ```

Example:
```bash
npx jest test/unit/create-review.test.ts
```

---

### **4.2 Integration Tests**

1. **Run All Integration Tests**:
   ```bash
   npx jest test/integration --runInBand
   ```

2. **Run Integration Tests for a Specific File**:
   ```bash
   npx jest test/integration/<test-file-name>.test.ts
   ```

Example:
```bash
npx jest test/integration/get-review.integration.test.ts
```

---

## **5. Monitoring and Debugging**

1. **CloudWatch Logs**:
   - Access detailed logs for Lambda functions in the AWS Management Console.

2. **API Gateway Metrics**:
   - Monitor latency and error rates in CloudWatch Metrics.

3. **Dead Letter Queue**:
   - Check the SQS queue for failed Lambda events.

