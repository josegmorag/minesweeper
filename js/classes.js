class simplegui {
    constructor(width,height){
        this.width = width;
        this.height = height;
        
    }

    create(){
        let canvas = document.createElement("canvas");
        canvas.height = this.height;
        canvas.width = this.width;
        canvas.setAttribute('id','frame')
        document.getElementById("gamearea").appendChild(canvas);
        canvas.addEventListener("mousedown",mouseclick,false);
        canvas.addEventListener("mouseup",mouseup,false);
        canvas.addEventListener("contextmenu",mouseright,false); 
        
    }
    draw(){
       
        let canvas = document.getElementById('frame')
        let ctx = canvas.getContext("2d");
        let strbomb = tablero.bombs.toString();
       
        ctx.beginPath();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
       
        if (strbomb.length > 1) {
           ctx.drawImage(img,0,32,13,26,0,0,13,27);
		   ctx.drawImage(img,parseInt(strbomb[0]) * 13,32,13,26,13,0,13,27);
           ctx.drawImage(img,parseInt(strbomb[1]) * 13,32,13,26,26,0,13,27);
        }
        else{
            ctx.drawImage(img,0,32,13,26,0,0,13,27);
            ctx.drawImage(img,0,32,13,26,13,0,13,27);
            ctx.drawImage(img,parseInt(strbomb[0]) * 13,32,13,26,26,0,13,27);
        }
        
        ctx.drawImage(img,number3*13,32,13,26,tablero.columna*16-39,0,13,27);
		ctx.drawImage(img,number2*13,32,13,26,tablero.columna*16-26,0,13,27);
		ctx.drawImage(img,number1*13,32,13,26,tablero.columna*16-13,0,13,27);

        ctx.drawImage(img,face * 26,55,26,26,(tablero.columna*16) / 2 - 13,0,26,26);

        for (let i=0;i<tablero.columna;i++) {
            for(let j=0;j<tablero.fila;j++) {
                
                if (tablero.destapadas[i][j]){
                   ctx.drawImage(img,offsetx[tablero.valor[i][j]]*16,offsety[Math.floor(tablero.valor[i][j]/9)],16,16,(i*16),(j*16)+26,16,16);
                }
                else {
                    ctx.drawImage(img,80,16,16,16,(i*16),(j*16)+26,16,16);
                }
                
            }	
        }
        
    }
    
}

class Tablero{
    constructor(columna,fila,bombs){
        this.columna = columna;
        this.fila = fila;
        this.bombs = bombs;
        this.clearBombs = bombs;
        this.valor = new Array(this.columna); for (var i = 0; i < this.valor.length; ++ i)
        this.valor [i] = new Array(this.fila);

        this.destapadas = new Array(this.columna); for (var i = 0; i < this.destapadas.length; ++ i)
        this.destapadas [i] = new Array(this.fila);

        this.isBomb = new Array(this.columna); for (var i = 0; i < this.isBomb.length; ++ i)
        this.isBomb [i] = new Array(this.fila);


        for (var i=0;i<=columna-1;i++) {
            for (var j=0;j<=fila-1;j++){
                this.valor[i][j]= '0';
                this.destapadas [i][j] = false;
                this.isBomb[i][j] = false;
            }  
        }

    }
    carga_minas(event){
       let total = 0;
       let x = Math.ceil(event.offsetX / 16);
       let y = Math.floor((event.offsetY - 26) / 16 );
       
       for (let i=x-1; i<=x+1;i++){
           for(let j=y-1;j<=y+1;j++){
              if (i != -1 && j != -1 && i < 8 && j < 8){
                 this.destapadas[i][j] = true;
              }
           }
       }
       
       while (total < this.bombs){
           let x = Math.floor(Math.random() * this.columna);
           let y = Math.floor(Math.random() * this.fila);
           if (this.valor[x][y] !='9' && !this.destapadas[x][y]){
                this.valor[x][y] = '9';
                this.isBomb[x][y] = true;
                total++;
           }
       }

       for (let i=x-1; i<=x+1;i++){
           for(let j=y-1;j<=y+1;j++){
              if (i != -1 && j != -1 && i <8 && j<8){
                 this.destapadas[i][j] = false;
              }
            }
        }

        for (x=0;x<this.columna;x++){
            for (y=0;y<this.fila;y++){
                this.cuenta_minas(x,y);
            }
        }
    }
    cuenta_minas(x,y){
       let contador= 0;
       for (let i=x-1;i<=x+1;i++){
           for (let j=y-1;j<=y+1;j++){
               if (i !=-1 && j !=-1 && i !=this.columna && j != this.fila && this.valor[x][y] != "9"){
                  if (this.valor[i][j] == "9"){
                      contador++;
                  }       
                }
            }
        }    
        if (contador> 0){
           this.valor[x][y]=contador.toString();
        }
    }
}

function new_game(){
    primera = true;
    running = false;
    clearInterval(interval);
    number1=0;
    number2=0;
    number3=0;
    descubiertas=0;
    face = 1
    let bombs;
    let rows;
    let columns;
    let canvas = document.getElementById("frame");
    document.getElementById("gamearea").removeChild(canvas);
       
    const customs = document.getElementsByClassName('custom');  
    for (let i=0; i < customs.length; i++){
        customs[i].style.display = "none";
        customs[i].addEventListener("input",null,false);
    }
    
    

    let value = 0;
    for (i=0;i<=rad.length-1;i++){
        if (rad[i].checked){
           value = i; 
        }
    }
    switch(value){
        case 0:
          tablero = new Tablero(9,9,10);
          break;
        case 1:
          tablero = new Tablero(16,16,40);
          break;
        case 2:
          tablero = new Tablero(30,16,99);
          break;
        case 3:
           for (let i=0; i < customs.length; i++){
                 customs[i].style.display = "inline";
                
            }
           tablero = new Tablero(parseInt(customs[1].value),parseInt(customs[3].value),parseInt(customs[5].value));
           break;
    }
    
    frame =  new simplegui(tablero.columna*16,tablero.fila*16+26);
    startGame();
}
      
function startGame() {
    frame.create();
    frame.draw();
    
   interval= setInterval(() => {
        tick();
        frame.draw();
    }, 1000);
} 

function tick(){
    if ((running) && (number1 < 9 || number2 < 9 || number3 < 9)){
        number1++;
        if (number1>9) {
            number1 =0;
            number2++;
            if (number2>9){
            number2=0;
            number3++;
            }
        }
    }
   
}

function destape(i,j){
  tablero.destapadas[i][j] = true;
  for (var k=i-1;k<=i+1;k++) 
      for (var l=j-1;l<=j+1;l++) 
          if (k >=0 && l >= 0 && k < tablero.columna && l <tablero.fila) {
             if (tablero.valor[k][l] == '0' && !tablero.destapadas[k][l]) {
                destape(k,l);
             }
             else {
                if (!tablero.destapadas[k][l]) {
                     tablero.destapadas[k][l] = true;
                     descubiertas++;
                }
             }   
        }
   descubiertas++;
  
}
function mouseclick(event){
    if (event.buttons === 1){
        if (event.offsetY > 25 ) {
        
            
            if (primera){
            tablero.carga_minas(event);
            primera = false; 
            running = true;
            }

            if (running){
                face = 2;
                jugar(event);
                frame.draw();
            }
        }
        else {
            if (event.offsetX > (tablero.columna*16)/2-13 && event.offsetX < (tablero.columna*16)/2+13) {
                new_game();
            }
        }  
    }
    else {
        if (event.buttons === 2 && event.offsetY > 25 && running && tablero.bombs > 0){
            let i = Math.floor(event.offsetX / 16);
            let j = Math.floor((event.offsetY-26) / 16 );

            if (!tablero.destapadas[i][j]){
                    tablero.valor[i][j] = '12'
                    tablero.destapadas[i][j] = true;
                    tablero.bombs--;
                    descubiertas++;

                    if (tablero.isBomb[i][j]){
                        tablero.clearBombs--;
                        if (tablero.clearBombs == 0){
                            face = 4
                            running = false;
                        }
                    }
            }
            else {
                 if (tablero.valor[i][j] == '12'){
                      tablero.destapadas[i][j] = false;
                      tablero.bombs++;
                      descubiertas--;
                 }
                    
            }
              
                
            
        }
    }  

}

function mouseup(event){
      if (face < 3){
          face = 1;
      }    
      frame.draw();
}

function mouseright(event){
    event.preventDefault();
   
}
    
function jugar(event){
    
    let i = Math.floor(event.offsetX / 16);
    let j = Math.floor((event.offsetY-26) / 16 );
    
    if (!tablero.destapadas[i][j] && running){
            
            if (tablero.valor[i][j] == '0') {
                destape(i,j);
            }
            else{
                if (tablero.valor[i][j] !='9'){
                    tablero.destapadas[i][j]=true;
                   
                    descubiertas++;
                    
                }
                else{
                    for (let i=0;i<tablero.columna;i++) {
                        for(let j=0;j<tablero.fila;j++) {
                            if (tablero.valor[i][j] == '9'){
                                tablero.destapadas[i][j] = true;
                            }
                            if (!tablero.isBomb[i][j] && tablero.valor[i][j] == '12'){
                                tablero.valor[i][j] = '10';
                            }
                        }
                    }
                    tablero.valor[i][j] = '11';
                    face=3;
                    running=false;
                }
                
            }

            if (descubiertas === (tablero.columna * tablero.fila) - tablero.bombs){
                for (let i=0;i<tablero.columna;i++) {
                    for(let j=0;j<tablero.fila;j++) {
                        if (tablero.valor[i][j] == '9'){
                            tablero.destapadas[i][j]=true;
                            tablero.valor[i][j] = '12';
                            face = 4;
                            running = false;
                        }
                    }
                }    
            }
   }
    
}

let number1 = 0;
let number2 = 0;
let number3 = 0;
let descubiertas =0;
let running = false;
let primera = true;
let face = 1;
let rad = document.getElementsByName("level");        
let tablero = new Tablero(9,9,10);
let frame =  new simplegui(tablero.columna*16,tablero.fila*16+26);
let interval;
let offsetx={'0':0,'1':1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':0,'10':1,'11':2,'12':4};
let offsety={0:0,1:16};
let img = new Image();

Array.from(document.getElementsByName("level")).map(v=>addEventListener("change",new_game,false));
rad[0].checked = true;

img.src = "images/sprite.png"
window.addEventListener("load", startGame,false);
window.addEventListener("resize",()=>{
    let x = window.matchMedia("(max-width: 750px)");
    const customs = document.getElementsByClassName('custom');
   
    if (x.matches){
        rad[0].checked = true ;
        for (let i=0; i < customs.length; i++){
             customs[i].style.display = "none";
        }
    }
    new_game();
})
