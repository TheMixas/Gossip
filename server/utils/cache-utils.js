import cache from './../cache/cache.js'
//returns a promise
export const GetFromCache = async (key) => {
    try {
        return new Promise((resolve, reject) => {
            let data = cache[key]
            if (data !== undefined) {
                console.log("Cache hit: ", key)
                resolve(data)
            } else {
                console.log("Cache miss: ", key)
                reject("Cache miss")
            }
        })

    } catch (e) {
        console.log("cache-utils: GetFromCache: Encountered error while reading from cache: ", e)
    }
}
//returns a promise.
//might throw error , use catch block.
//expiry is in seconds.
//returns true if the key was set, false if it already exists
export const SetToCache = async (key, value, expiry) => {
    try {
        return new Promise((resolve, reject) => {
            if (cache[key] === undefined) {
                console.log("Setting cache: ", key)
                cache[key] = value
                setTimeout(() => {
                    console.log("Deleting cache: ", key)
                    delete cache[key]
                }, expiry * 1000)
                resolve(true)
            } else {
                console.log("Cache already exists: ", key)
                reject('Cache already exists for key: ' + key)
            }
        })
    } catch (e) {
        console.log("cache-utils: SetToCache: Encountered error while caching: ", e)
    }
}