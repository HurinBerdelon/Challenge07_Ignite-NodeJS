import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamoDBClient";

export const handle: APIGatewayProxyHandler = async (event) => {

    const { user_id } = event.pathParameters

    const response = await document.query({
        TableName: 'todo_list',
        KeyConditionExpression: 'user_id = :user_id',
        ExpressionAttributeValues: {
            ':user_id': user_id
        }
    }).promise()

    const todos = response.Items

    if (todos.length > 0) {
        return {
            statusCode: 200,
            body: JSON.stringify(todos)
        }
    }

    return {
        statusCode: 400,
        body: JSON.stringify({
            message: 'No todo found!'
        })
    }

}