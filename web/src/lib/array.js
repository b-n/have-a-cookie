export const flattenData = data => {
    return data.reduce((a, c) =>
        a.concat(c.data),
        []
    )
}

export const padArray = (data, factor) => {
    return data.map((d, i) => {
        if (i === 0) return d * (1 - factor)
        if (i === data.length - 1) return d * (1 + factor)
        return d
    })
}
