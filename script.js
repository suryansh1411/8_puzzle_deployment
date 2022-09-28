function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex != 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

class QueueElement{
    constructor(priority, state, solution)
    {
        this.priority = priority;
        this.state = state;
        this.solution = solution;
    }
}

class PriorityQueue{
    size = 0;
    items = [];

    constructor()
    {
        this.size=0;
        this.items=[];
    }

    heapify(index)
    {
        var lc=this.getLeftChildIndex(index);
        var rc=this.getRightChildIndex(index);

        if((lc==-1 || this.items[index].priority<=this.items[lc].priority) && (rc==-1 ||this.items[index].priority<=this.items[rc].priority))
        {
            
        }    
        else
        {
            var mn;
            if(rc==-1 || this.items[lc].priority<this.items[rc].priority)
            {
                mn=lc;
            }
            else 
            {
                mn=rc;
            }
            
            this.swap(index, mn);
            this.heapify(mn);
        }    
    }

    swap(index1, index2)
    {
        var tmp=this.items[index1];
        this.items[index1]=this.items[index2];
        this.items[index2]=tmp;
    }

    push(priority, state, solution)
    {
        var qele = new QueueElement(priority, state, solution);
        var index=this.size;

        this.items[index]=qele;
        this.size++;

        while(this.getParentIndex(index)!=-1 && this.items[this.getParentIndex(index)].priority>this.items[index].priority)
        {
            this.swap(index, this.getParentIndex(index));
            index=this.getParentIndex(index);
        }
    }

    isEmpty()
    {
        return this.size===0;
    }

    pop()
    {
        this.size--;
        this.swap(0, this.size);
        this.heapify(0);
    }

    
    top()
    {
        var top=this.items[0];
        return top;
    }

    getParentIndex(index)
    {
        if(index==0) return -1;

        var par=Math.floor(index/2);
        return par;
    }
    
    getLeftChildIndex(index)
    {
        var lc=-1;
        if(2*index+1<this.size)
        {
            lc = 2*index+1;
        }
        return lc;
    }

    getRightChildIndex(index)
    {
        var rc=-1;
        if(2*index+2<this.size)
        {
            rc = 2*index+2;
        }
        return rc;
    }
}


class Grid{
    state = [1,2,3,4,5,6,7,8,0];
    initial_state=[1,2,3,4,5,6,7,8,0];
    isSolutionAvailable;
    solution = [];

    constructor()
    {
        while(this.isSolvable()===false || this.isSolved()===true)
        {
            this.state = shuffle(this.state);
        }
        
        for(var i=0; i<this.state.length; i++)
        {
            this.initial_state[i]=this.state[i];
        }

        this.isSolutionAvailable=-1;   
    }

    new()
    {
        this.state = shuffle(this.state);
        while(this.isSolvable()===false || this.isSolved()===true)
        {
            this.state = shuffle(this.state);
        }
        
        for(var i=0; i<this.state.length; i++)
        {
            this.initial_state[i]=this.state[i];
        }

        this.isSolutionAvailable=-1;
    }

    isSolvable()
    {
        var invs=0;
        for(var i=0; i<this.state.length; i++)
        {
            if(this.state[i]==0)
            {
                continue;
            }

            var inv=this.state[i]-1;
            for(var j=0; j<i; j++)
            {
                if(this.state[j]==0) continue;
                if(this.state[j] < this.state[i]) inv--;
            }

            invs+=inv;
        }

        if(invs%2==0) return true;
        return false;
    }

    isSolved()
    {
        var ans=true;

        for(var i=0; i<8; i++)
        {
            if(this.state[i]===i+1)
            {
                continue;
            }
            return false;
        }

        return this.state[8]==0;
    }

    move(index)
    {
        var dirx=[-1, 0, 1, 0]
        var diry=[0, -1, 0, 1]

        var x=Math.floor(index/3);
        var y=index%3;

        for(var i=0; i<4; i++)
        {
            var a=x+dirx[i];
            var b=y+diry[i];

            if(a<0 || b<0 || a>=3 || b>=3)
            {
                continue;
            }

            if(this.state[a*3+b]==0)
            {
                var tmp=this.state[index];
                this.state[index]=this.state[3*a+b];
                this.state[3*a+b]=tmp;

                if(this.isSolutionAvailable!=-1 && this.solution[this.isSolutionAvailable]==(i+2)%4)
                {
                    this.isSolutionAvailable++;
                    if(this.isSolutionAvailable==this.solution.length) this.isSolutionAvailable=-1;
                }
                else
                {
                    this.isSolutionAvailable=-1;
                }

                break;
            }
        }
    }

    reset()
    {
        for(var i=0; i<9; i++)
        {
            this.state[i]=this.initial_state[i];
        }
    }

    heuristic_func(currState)
    {
        var score=0;

        for(var i=0; i<9; i++)
        {
            var goal_index;
            if(currState[i]==0)
            {
                goal_index=8;
            }
            else
            {
                goal_index=currState[i]-1;
            }

            score += Math.abs(Math.floor(goal_index/3) - Math.floor(i/3)) + Math.abs(goal_index%3 - i%3);
        }

        return score;
    }


    hint()
    {
        var dirx=[-1, 0, 1, 0];
        var diry=[0, -1, 0, 1];
        
        if(this.isSolutionAvailable===-1)
        {
            this.solve();
        }
        var zero;
        for(var i=0; i<9; i++)
        {
            if(this.state[i]==0)
            {
                zero=i;
            }
        }
    
        var a=Math.floor(zero/3)+dirx[+this.solution[this.isSolutionAvailable]]+'';
        var b=zero%3+diry[this.solution[this.isSolutionAvailable]]+'';

        document.getElementById(a+b).style.backgroundColor="rgba(51, 170, 51,  0.5)";
    }


    solve()
    {
        var solved=87654321;
        var dirx=[-1, 0, 1, 0]
        var diry=[0, -1, 0, 1]

        var visited = new Set();
        var pq = new PriorityQueue();
        
        var currState = [];
        for(var i=0; i<9; i++) currState[i]=this.state[i];
        pq.push(this.heuristic_func(currState), currState, "");
       
        while(pq.isEmpty()==false)
        {
            var tmpState=pq.top();
            pq.pop();

            var aux=0;
            for(var i=0;i<9;i++)
            {
                aux+=Math.pow(10, i)*tmpState.state[i];
            }

            if(visited.has(aux))
            {
                continue;
            } 
            visited.add(aux);

            if(aux===solved)
            {
                for(var i=0; i<tmpState.solution.length; i++)
                {
                    this.solution[i]=+tmpState.solution[i];
                }
                this.isSolutionAvailable=0;
            }

            var zero;
            for(var i=0; i<9; i++)
            {
                if(tmpState.state[i]==0)
                {
                    zero=i;
                }
            }

            
            for(var j=0; j<4; j++)
            {
                var nextState = [];
                var a=Math.floor(zero/3)+dirx[j];
                var b=zero%3+diry[j];

                if(a<0 || b<0 || a>=3 || b>=3)
                {
                    continue;
                }

                for(var i=0; i<9; i++) nextState[i]=tmpState.state[i];
                
                nextState[zero]=nextState[3*a+b];
                nextState[3*a+b]=0;
                
                var direction = j+'';
                pq.push(this.heuristic_func(nextState), nextState, tmpState.solution+direction);
            }
        }
    }
}


class Game{
    grid;

    constructor()
    {
        this.grid = new Grid();
        this.render();
        
        if(this.grid.isSolutionAvailable===-1)
        {
            this.grid.solve();
        }

        for(var i=0; i<9; i++)
        {
            var f=Math.floor(i/3)+'';
            var s=i%3+'';

            document.getElementById(f+s).addEventListener("click",(ele) => {    
                var index = (+ele.srcElement.id[0])*3+(+ele.srcElement.id[1]);
                this.grid.move(index);
                this.render();
                
                // if(this.grid.isSolutionAvailable===-1)
                // {
                //     this.grid.solve();
                // }
            });
        }    
        
        document.getElementById("reset").addEventListener("click", () =>{
            this.grid.reset();
            this.render();
        });

        document.getElementById("hint").addEventListener("click", () =>{
            
            this.render();
            this.grid.hint();
        });
    }

    render()
    {

        for(var i=0; i<9; i++)
        {
            var f=Math.floor(i/3)+'';
            var s=i%3+'';
            if(this.grid.state[i] === 0)
            {
                document.getElementById(f+s).innerHTML='';
                document.getElementById(f+s).style.backgroundColor="#cfcfcf";     
            }
            else
            {
                document.getElementById(f+s).innerHTML=this.grid.state[i];     
                document.getElementById(f+s).style.backgroundColor="#cfcfcf";
            }         
        }
   
        if(this.grid.isSolved())
        {
            document.getElementById("message").style.display="block";
            document.getElementById("reset").style.display="none";
            document.getElementById("hint").style.display="none";    
        }
    }

    new()
    {
        this.grid.new();
        this.render();
        if(this.grid.isSolutionAvailable===-1)
        {
            this.grid.solve();
        }
    }
}

game = new Game();

document.getElementById("newGame").addEventListener("click", () =>{
    game.new();
    
    document.getElementById("message").style.display="none";
    document.getElementById("reset").style.display = "block";
    document.getElementById("hint").style.display = "block";
});

