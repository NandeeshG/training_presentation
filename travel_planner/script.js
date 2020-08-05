/* eslint-disable no-debugger, no-console, no-unused-vars, no-undef */
onload = function () {

    const cities = ['Red Fort','Taj Mahal','Pangong Lake','Jaisalmer Fort','Hampi','Charminar','Amber Fort','Elephanta Caves','Tawang Monastery','Kesaria Stupa','Sun Temple','Mysore Palace','Gwalior Fort','The Great Stupa','Humayuns Tomb','Mahabalipuram','Gateway of India','Lotus Temple'];

    var container1 = document.getElementById('container1');
    var container2 = document.getElementById('container2');
    var genNew = document.getElementById('get_button');
    var solve = document.getElementById('solve_button');
    var temptext = document.getElementById('temptext');
    var temptext2 = document.getElementById('temptext2');
    
    // create a network
    var curr_data;
    var sz,src,dst;
    
    // initialise graph options
    var options = {
        edges: {
            labelHighlightBold: true,
            font: {
                size: 20
            }
        },
        nodes: {
            font: '12px arial red',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf024',
                size: 40,
                color: '#991133',
            }
        }
    };

    const network = new vis.Network(container1);
    network.setOptions(options);

    function createData(){
        const V = Math.floor(Math.min(Math.random()*cities.length,13))+3;

        let vertices = [];
        for(let i=0; i<V; i++){
            vertices.push({id:i, label: cities[i]});
            console.log(cities[i]);
        }

        console.log(vertices);

        let edges = [];
        for(let i=0; i<V; i++){
            let neigh = i;
            while(neigh==i) neigh = Math.floor(Math.random()*V);
            edges.push({from:i, to:neigh, color: 'orange', 
                        label: String(Math.floor(Math.random()*70)+30)});
        }

        src = Math.floor(Math.random()*V);
        dst = V-1;
        if(src==dst)
            src=0;

        const data = {
            nodes : vertices,
            edges: edges
        };
        curr_data = data;
        sz = vertices.length;

        return data;
    }

    genNew.onclick = function () {
        let data = createData();
        console.log(data);
        network.setData(data);

        temptext2.innerText = "Find shortest path from "+cities[src]+ " to " +cities[dst];
        temptext2.style.display = "inline";
        //container2.style.display = "none";
    };

    solve.onclick = function () {
        temptext2.style.display = 'none';
        var new_data = solveData(sz);
        network.setData(new_data);
    };

    function dijkstra(graph, sz, src) {
        let vis = Array(sz).fill(0);
        let dist = [];
        for(let i=1;i<=sz;i++)
            dist.push([10000,-1]);
        dist[src][0] = 0;   //dist src to src is 0

        for(let i=0;i<sz;i++){
            let mn = -1;
            for(let j=0;j<sz;j++){
                if(vis[j]===0){
                    if(mn===-1 || dist[j][0]<dist[mn][0])
                        mn = j;
                }
            }

            vis[mn] = 1;
            for(let j in graph[mn]){
                let edge = graph[mn][j];
                if(vis[edge[0]]===0 && dist[edge[0]][0]>dist[mn][0]+edge[1]){
                    dist[edge[0]][0] = dist[mn][0]+edge[1];
                    dist[edge[0]][1] = mn;
                }
            }
        }

        return dist;
    }

    function solveData(sz) {
        let data = curr_data;
        var graph = [];
        for(let i=0;i<=sz;i++){
            graph.push([]);
        }

        for(let i=0;i<data['edges'].length;i++) {
            let edge = data['edges'][i];
            graph[edge['to']].push([edge['from'],parseInt(edge['label'])]);
            graph[edge['from']].push([edge['to'],parseInt(edge['label'])]);
        }

        let dist1 = dijkstra(graph,sz,src);

        new_edges = [];
        new_edges.concat(pushEdges(dist1, dst));
        data = {
            nodes: data['nodes'],
            edges: new_edges
        };
        return data;
    }

    function pushEdges(dist, curr) {
        new_edges = [];
        while(dist[curr][0]!=0){
            let fm = dist[curr][1];
            new_edges.push({
                    from: fm,
                    to: curr,
                    color: 'green',
                    label: String(dist[curr][0] - dist[fm][0])});
            curr = fm;
        }
        return new_edges;
    }

    genNew.click();
};
