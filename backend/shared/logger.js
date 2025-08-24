const logEndpointHit = (endpointName) => {
    console.log(`${endpointName} endpoint hit.`);
}

const logEndpointHitWithId= (endpointName, id) => {
    console.log(`${endpointName} endpoint hit with id: ${id}`);
}
    
module.exports = { logEndpointHit, logEndpointHitWithId };