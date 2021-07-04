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
       
     //   canvas.addEventListener("touchstart",process_touchstar,false);
     //   canvas.addEventListener("touchend",mouseup,false);           
    }
    draw(){
       
        let canvas = document.getElementById('frame')
        let ctx = canvas.getContext("2d");
       
        ctx.beginPath();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
       
        ctx.drawImage(img,0,32,13,26,0,0,13,27);
		ctx.drawImage(img,13,32,13,26,13,0,13,27);
        ctx.drawImage(img,0,32,13,26,26,0,13,27);
        
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
        this.valor = new Array(this.columna); for (var i = 0; i < this.valor.length; ++ i)
        this.valor [i] = new Array(this.fila);

        this.destapadas = new Array(this.columna); for (var i = 0; i < this.destapadas.length; ++ i)
        this.destapadas [i] = new Array(this.fila);

        for (var i=0;i<=columna-1;i++) {
            for (var j=0;j<=fila-1;j++){
                this.valor[i][j]= '0';
                this.destapadas [i][j] = false;
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