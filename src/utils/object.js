export function isNil (value) {
    return value == null
}

export function invert (object) {
    const inverted = {}
    for (let key in object) {
        const value = object[key]
        inverted[value] = key
    }
    return inverted
}