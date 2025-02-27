/**
 * Singleton bucket connection
 */
const {initCouchbaseBucket} = require('../util/couchbaseClient');


/**
 * Get Airline by Id
 */
exports.getByIdHandler = async (event) => {

    let response = {};

    try {
        // Get the Couchbase bucket (singleton)
        const bucket = await initCouchbaseBucket();
        const collection = bucket.scope("inventory").collection("airline");

        // Get id from pathParameters from APIGateway because of `/{id}` at template.yaml
        const id = event.pathParameters.id;

        if (!id) {
            throw new Error("Airline id is required for this operation");
        }

        const result = await collection.get(id);
        response = {
            statusCode: 200,
            body: JSON.stringify(result)
        };
    } catch (ResourceNotFoundException) {
        response = {
            statusCode: 404,
            body: "Airline not found."
        };
    }

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
