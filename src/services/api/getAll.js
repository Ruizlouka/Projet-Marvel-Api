const axios = require('axios')
const env = process.env

exports.getAll = async (req, res, parentDataName, childsName) => {
    const parentData = await axios.get(parentDataName)
        .catch(function (error) {
            res.json(error)
        })
        
        var paths = env.PATHS.split(",");

        childRoute = parentData

        paths.forEach((element, index) => {
            childRoute = childRoute[paths[index]]
        });
        
    const [childs] = await Promise.all(
        await childsName.map(async childName => await getDatas(childRoute, parentDataName, childName))
    )

    for (let child = 0; child < childsName.length; child++) {
        childRoute[childsName[child]] = childs[child]
    }

    res.json(parentData.data)
}

async function getDatas(parentData, parentDataName, ressourceName) {
    return await Promise.all(
        parentData.map(async parent => {

            const child = await axios.get(`${parentDataName}/${parent.id}/${ressourceName}`)
            parent[ressourceName] = child.data?.data.results ?? []
            return parent
        })
    )
}
