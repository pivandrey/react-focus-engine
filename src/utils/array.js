export function without (needles, haystack) {
    return haystack.filter(item => !needles.includes(item))
}

export function identity (value) {
    return value
}

export function copy (array) {
    return array.map(identity)
}

export function sortBy (f, array) {
    return copy(array).sort((a, b) => {
        const fa = f(a)
        const fb = f(b)
        return fa === fb ? 0 : fa > fb ? 1 : -1
    })
}