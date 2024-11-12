// couchbaseClient.js
const couchbase = require('couchbase');
// Get Couchbase information
const {COUCHBASE_HOST, COUCHBASE_BUCKET, COUCHBASE_USERNAME, COUCHBASE_PASSWORD} = process.env;

let bucket = null; // Cached bucket instance
console.log(COUCHBASE_HOST, COUCHBASE_BUCKET, COUCHBASE_USERNAME, COUCHBASE_PASSWORD);

// Function to initialize Couchbase and get the bucket
async function initCouchbaseBucket() {
    if (bucket) {
        console.log('Bucket already initialized...');
        return bucket;
    }
    try {
        console.log(COUCHBASE_HOST);
        console.log(COUCHBASE_BUCKET);
        console.log(COUCHBASE_PASSWORD);
        console.log(COUCHBASE_USERNAME);
        // Initialize cluster
        console.log('Initializing Couchbase cluster and bucket...');
        const cluster = await couchbase.connect(`couchbases://${COUCHBASE_HOST}`, {
            username: COUCHBASE_USERNAME,
            password: COUCHBASE_PASSWORD
        });

        // Cache the bucket for future calls
        bucket = cluster.bucket(COUCHBASE_BUCKET);
        console.log('Couchbase bucket initialized.');
    } catch (error) {
        console.error('Error initializing Couchbase bucket:', error);
        throw error;
    }
    return bucket;
}

// Export the function to be used in other modules
module.exports = {initCouchbaseBucket};
