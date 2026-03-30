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
        
        canvas.addEventListener("touchstart",ontouchstart, {passive: false});
        canvas.addEventListener("touchmove",ontouchmove, {passive: false});
        canvas.addEventListener("touchend",ontouchend, {passive: false});
    }
    draw(){
       
        let canvas = document.getElementById('frame')
        let ctx = canvas.getContext("2d");
        let strbomb = tablero.bombs.toString();

        if (strbomb.length < 3) {
            strbomb = "0" + strbomb;
        }
       
        ctx.beginPath();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
       
        if (strbomb.length > 1) {
           ctx.drawImage(img,parseInt(strbomb[0]) * 13,32,13,26,0,0,13,27);
		   ctx.drawImage(img,parseInt(strbomb[1]) * 13,32,13,26,13,0,13,27);
           ctx.drawImage(img,parseInt(strbomb[2]) * 13,32,13,26,26,0,13,27);
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
    carga_minas(pos){
       let total = 0;
       let x = Math.floor(pos.x / 16);
       let y = Math.floor((pos.y - 26) / 16 );
       
       for (let i=x-1; i<=x+1;i++){
           for(let j=y-1;j<=y+1;j++){
              if (i >= 0 && j >= 0 && i < this.columna && j < this.fila){
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
              if (i >= 0 && j >= 0 && i < this.columna && j < this.fila){
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
               if ((i !=-1 && j !=-1 ) && (i !=this.columna && j != this.fila) && this.valor[x][y] != "9"){
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
           let cols = parseInt(customs[1].value);
           let fils = parseInt(customs[3].value);
           let bom = parseInt(customs[5].value);
           
           let maxBombas = (cols * fils) - 9;
           if (bom > maxBombas) { bom = maxBombas; }
           
           tablero = new Tablero(cols, fils, bom);
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
function processAction(pos, isRightClick){
    let offsetX = pos.x;
    let offsetY = pos.y;
    
    if (!isRightClick){
        if (offsetY > 25 ) {
        
            
            if (primera){
            tablero.carga_minas(pos);
            primera = false; 
            running = true;
            }

            if (running){
                face = 2;
                jugar(pos);
                frame.draw();
            }
        }
        else {
            if (offsetX > (tablero.columna*16)/2-13 && offsetX < (tablero.columna*16)/2+13) {
                new_game();
            }
        }  
    }
    else {
        if (offsetY > 25 && running && tablero.bombs > 0){
            let i = Math.floor(offsetX / 16);
            let j = Math.floor((offsetY-26) / 16 );

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
                      
                      if (tablero.isBomb[i][j]) {
                          tablero.clearBombs++;
                      }
                 }
                    
            }
              
                
            
        }
    }  

}

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var scaleY = canvas.height / rect.height;
    
    var clientX = event.clientX;
    var clientY = event.clientY;
    
    if (event.type.startsWith('touch') && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else if (event.type === 'touchend' && event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
    }

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

let touchTimer = null;
let touchMoved = false;
let lastTouchPos = null;

function ontouchstart(event) {
    if(event.touches.length > 1) return;
    event.preventDefault();
    touchMoved = false;
    lastTouchPos = getMousePos(document.getElementById('frame'), event);
    
    face = 2;
    frame.draw();
    
    touchTimer = setTimeout(() => {
        if (!touchMoved && lastTouchPos) {
            processAction(lastTouchPos, true);
            frame.draw();
            if (navigator.vibrate) navigator.vibrate(50);
            touchTimer = null;
        }
    }, 400);
}

function ontouchmove(event) {
    event.preventDefault();
    touchMoved = true;
    if (touchTimer) {
        clearTimeout(touchTimer);
        touchTimer = null;
        if (face < 3) face = 1;
        frame.draw();
    }
}

function ontouchend(event) {
    event.preventDefault();
    if (touchTimer) {
        clearTimeout(touchTimer);
        touchTimer = null;
        if (!touchMoved && lastTouchPos) {
            processAction(lastTouchPos, false);
        }
    }
    if (face < 3) face = 1;
    frame.draw();
}

function mouseclick(event){
    let pos = getMousePos(document.getElementById('frame'), event);
    processAction(pos, event.buttons === 2 || event.which === 3);
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
    
function jugar(pos){
    
    let i = Math.floor(pos.x / 16);
    let j = Math.floor((pos.y-26) / 16 );
    
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

Array.from(document.getElementsByName("level")).map(v=>v.addEventListener("change",new_game,false));
Array.from(document.getElementsByClassName("custom")).forEach(el => {
    if (el.tagName === 'INPUT') {
        el.addEventListener("change", () => {
            if (rad[3].checked) new_game();
        });
    }
});
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
