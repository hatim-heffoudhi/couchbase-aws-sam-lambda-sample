/**
 * Singleton bucket connection
 */
const {initCouchbaseBucket} = require('../util/couchbaseClient');
const couchbase = require('couchbase');
/**
 * Search Airline by name
 */
exports.searchAirlineHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);
    // Get id, body  from the body of the request
    const document = JSON.parse(event.body);
    const name = document.name;
    const limit = document.limit;
    let response = {};
    try {

        // get scope inventory ( singleton bucket)
        const bucket = await initCouchbaseBucket();
        const scope = bucket.scope("inventory");
        const collection = scope.collection("airline");
        // Perform FTS query at scope level
        const ftsResult = await scope.search(
            'airlines-name-index',
            couchbase.SearchQuery.match(name).fuzziness(2),
            {limit: limit}
        );
        console.log('RESULT:', ftsResult)
        // Fetch full documents for each ID in the FTS results
        const fullDocuments = await Promise.all(
            ftsResult.rows.map(async (row) => {
                try {
                    const doc = await collection.get(row.id);
                    return doc.content;
                } catch (err) {
                    console.error(`Failed to retrieve document with ID: ${row.id}`, err);
                    return err;
                }
            })
        );
        // get answer :)
        response = {
            statusCode: 200,
            body: JSON.stringify(fullDocuments)
        };
    } catch (error) {
        console.log(error);
        response = {
            statusCode: 500,
            body: error
        };
    }
    return response;
}
