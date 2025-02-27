/**
 * import couchbase client ( singleton)
 */
const {initCouchbaseBucket} = require('../util/couchbaseClient');

/**
 * Lambda function Upsert Airline
 */
exports.upsertAirlineHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);
    let response = {};

    try {

        // Get the Couchbase bucket (singleton)
        const bucket = await initCouchbaseBucket();
        // Get Collection Airline
        const collection = bucket.scope("inventory").collection("airline");
        // Get id, body  from the body of the request
        const document = JSON.parse(event.body);
        const id = document.id;
        // upsert document
        const result = await collection.upsert(id, document);
        response = {
            statusCode: 200,
            body: JSON.stringify(result)
        };
    } catch (Error) {
        response = {
            statusCode: 500,
            body: "Unable to call Upsert operation."
        };
    }

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
