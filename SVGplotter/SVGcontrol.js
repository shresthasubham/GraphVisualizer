class graphNode
{
    constructor(x,y)
    {
        this.x = x;
        this.y = y;
        this.status = 0;
    }
}
class graphEdge
{
    constructor(v1,v2,weight)
    {
        this.v1 = v1;
        this.v2 = v2;
        this.weight = weight;
        this.status = 0;
    }
}
let numberOfNodes = 0;
let numberOfEdges =0;
let totalWeight =0;


let prims = false;
let nodes = [];
let displayNodes = [];
let edges = [];
let edgeWeightTexts = [];
let displayEdges =[];


let nodesPlaced = false;
let edgesEntered = false;
let edgesCreated = false;
let algorithmExecuted = false;
let vertexFound  = true;

let nodeIsBig = false;

//greens dark to light

neonGreen="rgb(57, 255, 20)";
webChartreuse="rgb(136, 255, 12)";
springBud="rgb(176, 255, 8)";	
traditionalChartreuse="rgb(215, 255, 4)";

myGreen ="rgb(158,255,0)";
myGreen2 = "rgb(122, 243, 10)";

//blues dark to light 
catalinaBlue="rgb(18,76,162)";
yaleBlue="rgb(22,119,197)";
pictonBlue="rgb(61,189,255)";
electricBlue="rgb(100, 238, 250)";
paleAquamarine  = "rgb(164, 255, 236)";

//oranges dark to light
royalOrange="rgb(253, 147, 70)";
rajah="rgb(253, 167, 102)";	
mellowApricot="rgb(253, 183, 119)";

//yellows dark to light
yellow=	"rgb(255, 255, 0)";
gold = "rgb(255,215,0)";
lightgoldenrodyellow="rgb(250,250,210)";




function createSVGwindow()
{
    
    mainDisplayObject = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    mainDisplayObject.setAttribute('id','main-display');
    mainDisplayObject.setAttribute('onclick','insertGraphNode(event)');
   
    nodesSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    nodesSVG.setAttribute('id','nodesSVG');
   
    
    nodesSVG.innerHTML = `
    <defs>
    <radialGradient id="blueRadialGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" style="stop-color:${paleAquamarine};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${electricBlue};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${pictonBlue};stop-opacity:1" />
    </radialGradient>
    <radialGradient id="greenRadialGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" style="stop-color:${myGreen};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${springBud};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${webChartreuse};stop-opacity:1" />
    </radialGradient>
    <radialGradient id="orangeRadialGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" style="stop-color:${mellowApricot};stop-opacity:1" />
      <stop offset="50%" style="stop-color:${rajah};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${royalOrange};stop-opacity:1" />
    </radialGradient>
    <linearGradient id="redLinearGradient" gradientTransform="rotate(90)">
      <stop offset="0%" stop-color=${lightgoldenrodyellow} />
      <stop offset="50%" stop-color="red" />
      <stop offset="100%" stop-color=${lightgoldenrodyellow} />
    </linearGradient>
    <linearGradient id="blueLinearGradient" gradientTransform="rotate(90)">
      <stop offset="0%" stop-color=${paleAquamarine} />
      <stop offset="50%" stop-color=${pictonBlue} />
      <stop offset="100%" stop-color=${paleAquamarine} />
    </linearGradient>
    <linearGradient id="yellowLinearGradient" gradientTransform="rotate(90)">
      <stop offset="0%" stop-color=${lightgoldenrodyellow} />
      <stop offset="50%" stop-color=${gold} />
      <stop offset="100%" stop-color=${lightgoldenrodyellow} />
    </linearGradient>
    </defs>`;

    edgesSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    edgesSVG.setAttribute('id','edgesSVG');

    document.body.appendChild(mainDisplayObject);
    mainDisplayObject.appendChild(edgesSVG);
    mainDisplayObject.appendChild(nodesSVG);
    
}

function insertGraphNode(event)
{
    if(nodesPlaced) return;
    centreX = event.clientX - (screen.width-1200)/2;
    centreY = event.clientY - 80 ;
    let newCircleNode = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    newCircleNode.setAttribute('class','graph-node');
    newCircleNode.style.fill = "url(#blueRadialGradient)";
    newCircleNode.setAttribute('r', '20');
    newCircleNode.setAttribute('cx', `${centreX}`);
    newCircleNode.setAttribute('cy', `${centreY}`);
    newCircleNode.setAttribute('onmouseenter','makeNodeSlightlyBigger(this)');
    newCircleNode.setAttribute('onmouseleave','makeNodeSlightlySmaller(this)');
    nodesSVG.appendChild(newCircleNode);
    displayNodes.push(newCircleNode);
    
    nodeNumber = document.createElementNS('http://www.w3.org/2000/svg','text');
    nodeNumber.setAttribute('class','node-text');
    
    nodeNumber.setAttribute('x',`${centreX-4.5}`);
    nodeNumber.setAttribute('y',`${centreY+5}`);
    nodeNumber.appendChild(document.createTextNode(`${numberOfNodes}`));
    nodeNumber.setAttribute('fill','black');

    nodesSVG.appendChild(nodeNumber);

    let newNode = new graphNode(centreX, centreY);
    nodes.push(newNode);

    numberOfNodes++;
}

async function makeNodeSlightlyBigger(x)
{
    if(nodeIsBig)return;
    else nodeIsBig = true;
    x.setAttribute('r','22');
}
async function makeNodeSlightlySmaller(x)
{
    if(!nodeIsBig)return;
    else nodeIsBig =false;
    x.setAttribute('r','20');
}

function inputAdjacencyMatrix()
{
    if(numberOfNodes<4){
        window.alert("Please enter more nodes");
        return
    }
    if(edgesEntered) return;
    else edgesEntered = true;
    if(!nodesPlaced) nodesPlaced = true;
     
    edgeForm = document.createElement('div');
    edgeForm.setAttribute('id','input-form');
    document.body.appendChild(edgeForm);

    edgeTable = document.createElement('table');
    edgeForm.appendChild(edgeTable);

    topRow = document.createElement('tr');
    edgeTable.appendChild(topRow);
    topRow.appendChild(document.createElement('th'));
    
    for(let i =0; i< numberOfNodes;i++)
    {
        
        numberingCell = document.createElement('th');
        numbering = document.createTextNode(`${i}`);
        numberingCell.appendChild(numbering);
        topRow.appendChild(numberingCell);
    }
    
    for(let i =0;i<numberOfNodes;i++)
    {
        newRow = document.createElement('tr');
        numberingCell = document.createElement('th');
        numbering = document.createTextNode(`${i}`);
        numberingCell.appendChild(numbering);
        newRow.appendChild(numberingCell);
        for(let j=0;j<numberOfNodes;j++)
        {
            newCell = document.createElement('td');
            if(i<j)
            {
                inputSpace = document.createElement('input');
                inputSpace.setAttribute('id',`${i},${j}`);
                inputSpace.setAttribute('class', 'input-cell');
                inputSpace.setAttribute('type','number');
                inputSpace.setAttribute('min','0');
                inputSpace.setAttribute('step','1');
                newCell.appendChild(inputSpace);
            }
            newRow.appendChild(newCell);
            
        }
        edgeTable.appendChild(newRow);
    }
}
function createEdges()
{
    if(edgesCreated || !edgesEntered) return;
    else edgesCreated = true;
    adjacencyMatrix = [...Array(numberOfNodes)].map(e => Array(numberOfNodes).fill(0));
    for(let i=0;i<numberOfNodes;i++)
    {
        for(let j = i+1;j<numberOfNodes;j++)
        {
            
            currentCell = document.getElementById(`${i},${j}`);
            if(currentCell.value.length!=0)
            {
                adjacencyMatrix[i][j]= currentCell.value;
            }
        }
    }

    for(let i=0;i<numberOfNodes;i++)
    {
        for(let j = i+1;j<numberOfNodes;j++)
        {
            if(adjacencyMatrix[i][j]>0){
                let newLineEdge = document.createElementNS('http://www.w3.org/2000/svg','line');
                newLineEdge.setAttribute('class', 'graph-edge');
                newLineEdge.setAttribute('x1',`${nodes[i].x}`);
                newLineEdge.setAttribute('y1',`${nodes[i].y}`);
                newLineEdge.setAttribute('x2',`${nodes[j].x}`);
                newLineEdge.setAttribute('y2',`${nodes[j].y}`);
               
                textX= (nodes[i].x+nodes[j].x)/2 - 12;
                textY= (nodes[i].y+nodes[j].y)/2 - 12;
                edgeWeight = document.createElementNS('http://www.w3.org/2000/svg','text');
                edgeWeight.setAttribute('class','edgeWeight-text')
                edgeWeight.setAttribute('x',`${textX}`);
                edgeWeight.setAttribute('y',`${textY}`);
                edgeWeight.appendChild(document.createTextNode(`${adjacencyMatrix[i][j]}`));
                edgeWeight.setAttribute('fill','rgba(255,160,158,1)');
                edgesSVG.appendChild(edgeWeight);
                edgeWeightTexts.push(edgeWeight);

                numberOfEdges++;

                edgesSVG.appendChild(newLineEdge);
                displayEdges.push(newLineEdge);

                let newEdge= new graphEdge(i,j,adjacencyMatrix[i][j]);
                edges.push(newEdge);
            }
        }
    }
    
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function parentOf( n )
{
    if(parents[n].value ==-1) return n;
    return  parents[n].value = parentOf(parents[n].value);
}

function union( a, b)
{
    let x = parentOf(a);
    let y = parentOf(b);
    if(x!=y)
    {
        if(parents[x].rank < parents[y].rank)
        {
            parents[x].value = y;
        }
        else if(parents[x].rank > parents[y].rank)
        {
            parents[y].value = x;
        }
        else
        {
            parents[y].value = x;
            parents[x].rank++;
        }
    }
}

async function executeAlgorithm()
{
    if(algorithmExecuted || !edgesCreated) return;
    else algorithmExecuted = true;

    let algo = document.querySelector('input[name="algorithm"]:checked');
    if(algo.value == "Prim's")
    {
        scanningNode = 0;
        nodes[0].status = 1;
        displayNodes[0].style.fill ='url(#orangeRadialGradient)';
        numberOfVisitedNodes = 1;
        currentEdges = [];
        await sleep(1000);
        while(numberOfVisitedNodes<numberOfNodes && vertexFound)
        {
            vertexFound = false;
            
            for(let i = 0; i<numberOfEdges;i++)
            {
                
                if((edges[i].v1 == scanningNode || edges[i].v2==scanningNode)&& edges[i].status==0)
                {
                    
                    let edgeObject = {e: edges[i], w: edges[i].weight , index:i}
                    edges[i].status = 1;
                    displayEdges[i].style.stroke = "url(#blueLinearGradient)";
                    await sleep(200);
                    currentEdges.push(edgeObject);
                    

                }
            }
            await sleep(1000);
            
            currentEdges.sort((a,b)=>{return a.w - b.w});
            for(let i =0;i<currentEdges.length;i++)
            {
                if(nodes[currentEdges[i].e.v1].status==1)
                {
                    scanningNode = currentEdges[i].e.v2;
                }
                else
                {
                    scanningNode = currentEdges[i].e.v1;
                }

                if(nodes[scanningNode].status==0)
                {
                    vertexFound = true;
                    displayNodes[scanningNode].style.fill ='url(#orangeRadialGradient)';
                    nodes[scanningNode].status = 1;
                    displayEdges[currentEdges[i].index].style.stroke = "url(#yellowLinearGradient)";
                    edges[currentEdges[i].index].status = 2;
                    totalWeight += +currentEdges[i].w;
                    currentEdges.splice(i,1);
                    numberOfVisitedNodes++;
                    
                    await sleep(1000);
                    
                    break;
                }

            }
        
        }
    }
    else
    {
        parents = [];
        for(let i =0;i<numberOfNodes;i++)
        {
            let parentObject = {value:-1, rank:1};

            parents.push(parentObject);
        }
        currentEdges = [];
        numberOfEdgesAdded = 0;
        for(let i = 0; i<numberOfEdges;i++)
            {  
                let edgeObject = {e: edges[i], w: edges[i].weight , index:i}
                currentEdges.push(edgeObject);
            }
        currentEdges.sort((a,b)=>{return a.w - b.w});
        for(let i = 0; i<numberOfEdges;i++)
        {
            let firstVertex = currentEdges[i].e.v1;
            let secondVertex = currentEdges[i].e.v2;
            if(parentOf(firstVertex)!=parentOf(secondVertex))
            {
                displayNodes[firstVertex].style.fill ='url(#orangeRadialGradient)';
                nodes[firstVertex].status = 1;
                displayNodes[secondVertex].style.fill ='url(#orangeRadialGradient)';
                nodes[secondVertex].status = 1;
                displayEdges[currentEdges[i].index].style.stroke = "url(#yellowLinearGradient)";
                edges[currentEdges[i].index].status = 2;
                totalWeight += +currentEdges[i].w;
                numberOfEdgesAdded++;

                await sleep(500);

                union(firstVertex, secondVertex);
            }
        }
        
    }
    for(let i =0;i<numberOfNodes;i++)
    {
        displayNodes[i].style.fill ='url(#greenRadialGradient)';
        await sleep(200);
    }
    for(let i = 0; i<edges.length;i++)
        {
            if(edges[i].status!=2)
            {
                displayEdges[i].classList.add("hidden-element");
                edgeWeightTexts[i].classList.add("hidden-element");
            }
        }
        totalWeightText = document.createElementNS('http://www.w3.org/2000/svg','text');
        totalWeightText.setAttribute("font-size",'20px');
        totalWeightText.setAttribute('id',"total-weight-text");
        totalWeightText.setAttribute('x',`500px`);
        totalWeightText.setAttribute('y',`500px`);
        totalWeightText.appendChild(document.createTextNode(`Total Edge Weight: ${totalWeight}`));
        totalWeightText.setAttribute('fill',"rgb(158,255,0)");
        edgesSVG.appendChild(totalWeightText);
}