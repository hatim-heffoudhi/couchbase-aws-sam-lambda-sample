/**
 * import couchbase client ( singleton)
 */
const {initCouchbaseBucket} = require('../util/couchbaseClient');

/**
 * Lambda function Delete Airline
 */
exports.deleteAirlineHandler = async (event) => {
    if (event.httpMethod !== 'DELETE') {
        throw new Error(`deleteItemHandler only accepts DELETE method, you tried: ${event.httpMethod} method.`);
    }
    let response = {};
    try {

        // Get the Couchbase bucket (singleton)
        const bucket = await initCouchbaseBucket();
        // Get Collection Airline
        const collection = bucket.scope("inventory").collection("airline");
        // Get id from pathParameters from APIGateway because of `/{id}` at template.yaml
        const id = event.pathParameters.id;
        if (!id) {
            throw new Error("Document id is required for deletion.");
        }

        // Perform the delete operation
        const result = await collection.remove(id);
        //Provide Result
        response = {
            statusCode: 200,
            body: JSON.stringify({message: `Document with id ${id} deleted successfully.`, result})
        };
    } catch (error) {
        console.error('Error in deleteItemHandler:', error);

        // Handle Couchbase-specific errors or other exceptions
        if (error) {
            response = {
                statusCode: 500,
                body: JSON.stringify({error: "An error occurred while attempting to delete the document.", error})
            };
        }
    }

    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
