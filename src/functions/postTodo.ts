import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuidv4 } from 'uuid'
import { S3 } from 'aws-sdk'

import { document } from "src/utils/dynamoDBClient";

interface ITodo {
    id: string
    user_id: string
    title: string
    done: boolean
    deadline: Date
}

export const handle: APIGatewayProxyHandler = async (event) => {

    const { user_id } = event.pathParameters

    const { title, deadline } = JSON.parse(event.body) as ITodo

    const id = uuidv4()

    const todo = {
        id,
        user_id,
        title,
        done: false,
        deadline: new Date(deadline)
    }

    await document.put({
        TableName: 'todo_list',
        Item: todo
    }).promise()

    const s3 = new S3()

    await s3.putObject({
        Bucket: 'bucket-name',
        Key: `${id}`,
        ACL: 'public-read',
        Body: todo,
        ContentType: 'application/json'
    }).promise()

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: 'Todo Created'
        }),
        headers: {
            'Content-Type': "application/json"
        }
    }

}