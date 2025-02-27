/**
 * Singleton bucket connection
 */
const {initCouchbaseBucket} = require('../util/couchbaseClient');

/**
 * Get All Airlines
 */
exports.getAllAirlinesHandler = async (event) => {

    let response = {};
    let lastKey = "";
    let limit = 20;
    try {

        // get last key and limit
        if (event.queryStringParameters !== null && event.queryStringParameters !== undefined) {
            const queryParams = event.queryStringParameters;
            lastKey = queryParams.lastKey || "";
            if (queryParams.limit) {
                limit = parseInt(queryParams.limit);
            }
        }
        console.log("the last key is", lastKey)
        console.log("limit is", limit)
        // get scope inventory ( singleton bucket)
        const bucket = await initCouchbaseBucket();
        const scope = bucket.scope("inventory");

        // key Set pagination
        const query = `SELECT META().id, *
                       FROM \`airline\`
                       WHERE META().id > $lastKey
                       ORDER BY META().id LIMIT $limit`;
        const options = {parameters: {lastKey, limit}};

        // Execute query within the specified scope
        const result = await scope.query(query, options);
        // get answer :)
        response = {
            statusCode: 200,
            body: JSON.stringify(result)
        };
    } catch (error) {
        response = {
            statusCode: 500,
            body: error
        };
    }
    return response;
}
