'use strict'


// const readline = require("readline");
// const tree = ['.'];

// const reader = readline.createInterface({
//     input: fs.createReadStream(fileName)
// });

// reader.on("line", line => {
//     console.log(line);
//     const nodes = line.split('.');
//     for (let node of nodes) {
//         addNode(tree, node);
//     }
// });

// function createMapNodesVisited(nodesToAdd) {
//     return new Map(nodesToAdd.map(value => [value, false]));
// }


const fs = require("fs");
const fileName = "domains.txt";
const tree = {
    value: '.',
    children: []
};

let path = ['.'];
let level = 0;


function create() {
    const file = fs.readFileSync(fileName);

    const domains = file.toString().split('\n');

    for (let domain of domains) {
        print(domain);

        const nodesToAdd = domain.split('.').reverse();

        for (let node of nodesToAdd) {
            addNode(tree, node);
            level = 0;
        }

        print(tree);
        reset();
    }
}

function print(data) {
    console.log(data);
}

function reset() {
    path = ['.'];
    level = 0;
}

function isSearchedNode(node) {
    return path[level] === node.value
}

function isLevelToAdd() {
    return path.length === level + 1;
}

function valueToAddIsChildNode(nodeChildren, valueToAdd) {
    return nodeChildren.some(item => item.value === valueToAdd);
}

function addNode(node, value) {

    if (path.includes(value)) {
        return;
    }
    // Si el nodo actual es una hoja se agrega el nuevo nodo
    if (node.value === '.') {
        if (!valueToAddIsChildNode(node.children, value) && isLevelToAdd()) {
            node.children.push({ value, children: [] });
            path.push(value);
        }

        for (let child of node.children) {
            level++;
            addNode(child, value);
            level--;
        }
    }
    else {
        // Si hay un camino a recorrer aparte del nodo root (el valor del nodo root esta siempre en la posicion 0 de "path")
        if (path.length > 1) {
            // Si el nodo es parte del camino
            if (isSearchedNode(node)) {
                // Si estamos en el nivel donde se va agregar el nodo
                if (isLevelToAdd()) {
                    // Si el nodo actual no tiene como hijo un nodo con el valor a agregar, se agrega
                    // En caso de que lo tenga se deja el nodo que esta
                    if (!valueToAddIsChildNode(node.children, value)) {
                        node.children.push({ value, children: [] });
                    }

                    /* Se agregue o no un nuevo nodo al arbol, se agrega el value al array
                    que representa el camino recorrido (los nodos agregados del dominio) */
                    path.push(value);
                }
                // Sino sigo recorriendo el arbol por el camino encontrado
                else {
                    for (let child of node.children) {
                        level++;
                        addNode(child, value);
                        level--;
                    }
                }
            }
            else {
                for (let child of node.children) {
                    level++;
                    addNode(child, value);
                    level--;
                }
            }
        }
        else {
            if (node.value !== value && isLevelToAdd()) {
                node.children.push({ value, children: [] });
            }

            path.push(value);
        }
    }

}

function query(node, searchedDomain) {
    // Caso base
    if (searchedDomain.length === level) {
        return true;
    }

    const nodeIndex = node.children.findIndex(item => item.value === searchedDomain[level]);

    if (nodeIndex !== -1) {
        level++;
        return query(node.children[nodeIndex], searchedDomain);
    }

    return false;
}

function main(req, res) {
    create();

    const domain = req.query.domain;

    if (domain) {
        const searchedDomain = domain.split('.').reverse();

        const domainExists = query(tree, searchedDomain);

        res.status(200).send({ domainExists });
    }
    else {
        res.status(200).send(tree);
    }
}


module.exports = {
    main
}
